
import { useEffect, useRef, useState } from 'react';
import { MapPin, Hospital, Navigation, Search, X, Star, Phone, Globe, AlertCircle, Loader2 } from 'lucide-react';

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

interface HealthcareFacility {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  userRatingsTotal?: number;
  website?: string;
  isOpen?: boolean;
  position: google.maps.LatLng;
  marker: google.maps.Marker;
  infoWindow?: google.maps.InfoWindow;
  facilityType: 'hospital' | 'clinic' | 'pharmacy' | 'health' | 'unknown';
  distance?: number; // Distance in km from user location
}

type FacilityType = 'hospital' | 'doctor' | 'pharmacy' | 'health' | 'all';

const Map3D = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const facilitiesRef = useRef<HealthcareFacility[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapComponentRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [facilityType, setFacilityType] = useState<FacilityType>('all');
  const [searchRadius, setSearchRadius] = useState(5000);
  const [facilitiesCount, setFacilitiesCount] = useState(0);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'timeout'>('idle');

  // Google Maps place types mapping
  const getPlaceTypes = (type: FacilityType): string[] => {
    switch (type) {
      case 'hospital':
        return ['hospital'];
      case 'doctor':
        return ['doctor', 'dentist', 'physiotherapist'];
      case 'pharmacy':
        return ['pharmacy', 'drugstore'];
      case 'health':
        return ['health'];
      case 'all':
      default:
        return ['hospital', 'doctor', 'dentist', 'pharmacy', 'drugstore', 'health'];
    }
  };

  // Detect facility type from place types and name
  const detectFacilityType = (place: google.maps.places.PlaceResult, searchType: string): 'hospital' | 'clinic' | 'pharmacy' | 'health' | 'unknown' => {
    const types = place.types || [];
    const name = (place.name || '').toLowerCase();

    if (types.includes('hospital') || name.includes('hospital')) {
      return 'hospital';
    }
    if (types.includes('pharmacy') || types.includes('drugstore') || name.includes('pharmacy') || name.includes('chemist')) {
      return 'pharmacy';
    }
    if (types.includes('doctor') || types.includes('dentist') || types.includes('physiotherapist') || 
        name.includes('clinic') || name.includes('doctor') || name.includes('healthcare') || name.includes('medical')) {
      return 'clinic';
    }
    if (types.includes('health') || name.includes('health')) {
      return 'health';
    }

    // Fallback to search type
    if (searchType === 'hospital') return 'hospital';
    if (searchType === 'pharmacy' || searchType === 'drugstore') return 'pharmacy';
    if (searchType === 'doctor' || searchType === 'dentist' || searchType === 'physiotherapist') return 'clinic';
    
    return 'unknown';
  };

  // Get marker color based on facility type
  const getMarkerColor = (facilityType: 'hospital' | 'clinic' | 'pharmacy' | 'health' | 'unknown'): string => {
    switch (facilityType) {
      case 'hospital':
        return '#ef4444'; // RED
      case 'clinic':
        return '#3b82f6'; // BLUE
      case 'pharmacy':
        return '#22c55e'; // GREEN
      case 'health':
        return '#f59e0b'; // AMBER
      default:
        return '#6b7280'; // GRAY
    }
  };

  // Get custom SVG-based healthcare icon
  const getHealthcareIcon = (facilityType: 'hospital' | 'clinic' | 'pharmacy' | 'health' | 'unknown'): google.maps.Icon => {
    const iconConfigs: Record<string, { color: string; label: string; svg: string }> = {
      hospital: {
        color: '#ef4444',
        label: '🏥',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="50"><defs><style>.hospital-bg { fill: #ef4444; } .hospital-cross { fill: white; }</style></defs><path class="hospital-bg" d="M32 4C17.6 4 6 15.6 6 30c0 8 4 15 10 19.5l16 12.5 16-12.5c6-4.5 10-11.5 10-19.5 0-14.4-11.6-26-26-26z"/><rect class="hospital-cross" x="28" y="24" width="8" height="16"/><rect class="hospital-cross" x="22" y="30" width="20" height="8"/></svg>`,
      },
      clinic: {
        color: '#3b82f6',
        label: '⚕️',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="38" height="48"><defs><style>.clinic-bg { fill: #3b82f6; } .clinic-stethoscope { fill: white; }</style></defs><path class="clinic-bg" d="M32 4C17.6 4 6 15.6 6 30c0 8 4 15 10 19.5l16 12.5 16-12.5c6-4.5 10-11.5 10-19.5 0-14.4-11.6-26-26-26z"/><circle class="clinic-stethoscope" cx="22" cy="26" r="4"/><path class="clinic-stethoscope" d="M22 30 Q18 35 14 35 M22 30 Q26 35 30 35 M30 35 L38 35 L38 38 L30 38 L30 35"/></svg>`,
      },
      pharmacy: {
        color: '#22c55e',
        label: '💊',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="35" height="45"><defs><style>.pharmacy-bg { fill: #22c55e; } .pharmacy-pill { fill: white; }</style></defs><path class="pharmacy-bg" d="M32 4C17.6 4 6 15.6 6 30c0 8 4 15 10 19.5l16 12.5 16-12.5c6-4.5 10-11.5 10-19.5 0-14.4-11.6-26-26-26z"/><ellipse class="pharmacy-pill" cx="20" cy="28" rx="5" ry="6"/><ellipse class="pharmacy-pill" cx="32" cy="28" rx="5" ry="6"/><ellipse class="pharmacy-pill" cx="44" cy="28" rx="5" ry="6"/><rect class="pharmacy-pill" x="28" y="38" width="8" height="3" rx="1.5"/><rect class="pharmacy-pill" x="28" y="44" width="8" height="3" rx="1.5"/></svg>`,
      },
      health: {
        color: '#f59e0b',
        label: '🏥',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="46"><defs><style>.health-bg { fill: #f59e0b; } .health-heart { fill: white; }</style></defs><path class="health-bg" d="M32 4C17.6 4 6 15.6 6 30c0 8 4 15 10 19.5l16 12.5 16-12.5c6-4.5 10-11.5 10-19.5 0-14.4-11.6-26-26-26z"/><path class="health-heart" d="M32 22 C32 22 26 16 22 20 C18 24 22 30 32 38 C42 30 46 24 42 20 C38 16 32 22 32 22 Z"/></svg>`,
      },
      unknown: {
        color: '#6b7280',
        label: '📍',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="32" height="42"><defs><style>.unknown-bg { fill: #6b7280; } .unknown-dot { fill: white; }</style></defs><path class="unknown-bg" d="M32 4C17.6 4 6 15.6 6 30c0 8 4 15 10 19.5l16 12.5 16-12.5c6-4.5 10-11.5 10-19.5 0-14.4-11.6-26-26-26z"/><circle class="unknown-dot" cx="32" cy="28" r="6"/></svg>`,
      },
    };

    const config = iconConfigs[facilityType] || iconConfigs.unknown;
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(config.svg)}`;

    return {
      url: dataUrl,
      scaledSize: new window.google.maps.Size(40, 50),
      anchor: new window.google.maps.Point(20, 50),
      labelOrigin: new window.google.maps.Point(20, 15)
    };
  };

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Open Google Maps directions for a facility
  const openDirections = (placeId: string, placeName: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=place_id:${placeId}&travelmode=driving`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(placeName)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Request user location
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocationPermissionStatus('unavailable');
      return;
    }

    setLocationPermissionStatus('requesting');
    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLocationPermissionStatus('granted');
        setLoading(false);
        
        // Center map on user location
        if (mapRef.current) {
          mapRef.current.setCenter(location);
          mapRef.current.setZoom(14);
        }

        // Add user marker
        if (mapRef.current && !userMarkerRef.current) {
          userMarkerRef.current = new window.google.maps.Marker({
            position: location,
            map: mapRef.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3
            },
            title: 'Your Location',
            zIndex: 1000
          });
        }

        // Search for nearby facilities
        searchNearbyFacilities(location);
      },
      (error) => {
        setLoading(false);
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            setLocationPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            setLocationPermissionStatus('unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            setLocationPermissionStatus('timeout');
            break;
          default:
            setLocationPermissionStatus('unavailable');
            break;
        }
        
        setError(errorMessage);
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      },
      options
    );
  };

  // Clear existing markers
  const clearMarkers = () => {
    facilitiesRef.current.forEach(facility => {
      if (facility.marker) {
        facility.marker.setMap(null);
      }
      if (facility.infoWindow) {
        facility.infoWindow.close();
      }
    });
    facilitiesRef.current = [];
    setFacilitiesCount(0);
  };

  // Fetch detailed place information
  const fetchPlaceDetails = (placeId: string, callback: (place: google.maps.places.PlaceResult) => void, errorCallback?: () => void) => {
    if (!mapRef.current || !window.google) {
      if (errorCallback) errorCallback();
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'formatted_phone_number', 'international_phone_number', 'rating', 'user_ratings_total', 'website', 'opening_hours', 'geometry']
    };

    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        callback(place);
      } else {
        if (errorCallback) errorCallback();
      }
    });
  };

  // Search for nearby healthcare facilities
  const searchNearbyFacilities = (location: { lat: number; lng: number }) => {
    if (!mapRef.current || !window.google) return;

    setLoading(true);
    clearMarkers();

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const placeTypes = getPlaceTypes(facilityType);

    // Search for each place type
    let completedSearches = 0;
    const allFacilities: HealthcareFacility[] = [];

    placeTypes.forEach((type) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: searchRadius,
        type: type
      };

      service.nearbySearch(request, (results, status) => {
        completedSearches++;

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          results.forEach((place) => {
            if (place.geometry && place.geometry.location) {
              // Detect facility type for color-coding
              const facilityType = detectFacilityType(place, type);
              const markerColor = getMarkerColor(facilityType);
              const customIcon = getHealthcareIcon(facilityType);

              // Calculate distance from user location
              const distance = calculateDistance(
                location.lat,
                location.lng,
                place.geometry.location.lat(),
                place.geometry.location.lng()
              );

              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: mapRef.current!,
                icon: customIcon,
                title: place.name || 'Healthcare Facility',
                optimized: false // Smooth rendering
              });

              // Create initial info window content with basic data
              const initialInfoContent = createInfoWindowContent(place, facilityType, distance, place.place_id || '');

              const infoWindow = new window.google.maps.InfoWindow({
                content: initialInfoContent,
                maxWidth: 350
              });

              // Add click listener to marker - fetch full details on click
              marker.addListener('click', () => {
                // Close any open info windows
                if (infoWindowRef.current) {
                  infoWindowRef.current.close();
                }

                // Show loading state in info window
                infoWindow.setContent('<div style="padding: 16px; text-align: center;"><div style="border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div><p style="margin-top: 12px; color: #6b7280;">Loading details...</p></div>');
                infoWindow.open(mapRef.current!, marker);
                infoWindowRef.current = infoWindow;

                // Fetch full place details
                if (place.place_id) {
                  fetchPlaceDetails(
                    place.place_id,
                    (detailedPlace) => {
                      const detailedInfoContent = createInfoWindowContent(detailedPlace, facilityType, distance, place.place_id || '');
                      infoWindow.setContent(detailedInfoContent);
                    },
                    () => {
                      // If details fetch fails, show basic info with error message
                      const errorContent = createInfoWindowContent(place, facilityType, distance, place.place_id || '') + 
                        '<div style="margin-top: 8px; padding: 8px; background-color: #fef3c7; border-radius: 4px; font-size: 12px; color: #92400e;">⚠️ Some details could not be loaded. Showing available information.</div>';
                      infoWindow.setContent(errorContent);
                    }
                  );
                } else {
                  // No place_id available, show basic info
                  const basicContent = createInfoWindowContent(place, facilityType, distance, '');
                  infoWindow.setContent(basicContent);
                }
              });

              const facility: HealthcareFacility = {
                placeId: place.place_id || '',
                name: place.name || 'Unknown Facility',
                address: place.vicinity || place.formatted_address || 'Address not available',
                phone: place.formatted_phone_number || place.international_phone_number,
                rating: place.rating,
                userRatingsTotal: place.user_ratings_total,
                website: place.website,
                isOpen: place.opening_hours?.isOpen(),
                position: place.geometry.location,
                marker,
                infoWindow,
                facilityType,
                distance
              };

              allFacilities.push(facility);
            }
          });
        }

        // When all searches complete
        if (completedSearches === placeTypes.length) {
          facilitiesRef.current = allFacilities;
          setFacilitiesCount(allFacilities.length);
          setLoading(false);
        }
      });
    });
  };

  // Create info window content HTML
  const createInfoWindowContent = (place: google.maps.places.PlaceResult, facilityType?: 'hospital' | 'clinic' | 'pharmacy' | 'health' | 'unknown', distance?: number, placeId?: string): string => {
    const name = place.name || 'Unknown Facility';
    const address = place.vicinity || place.formatted_address || 'Address not available';
    const phone = place.formatted_phone_number || place.international_phone_number || 'Not available';
    const rating = place.rating || 0;
    const ratingCount = place.user_ratings_total || 0;
    const website = place.website;
    const isOpen = place.opening_hours?.isOpen();

    const statusColor = isOpen !== undefined ? (isOpen ? '#10b981' : '#ef4444') : '#6b7280';
    const statusText = isOpen !== undefined ? (isOpen ? 'Open' : 'Closed') : 'Status unknown';

    // Get facility type badge
    const facilityTypeLabel = facilityType ? facilityType.charAt(0).toUpperCase() + facilityType.slice(1) : '';
    const facilityTypeBg = facilityType === 'hospital' ? '#fee2e2' : 
                          facilityType === 'clinic' ? '#dbeafe' :
                          facilityType === 'pharmacy' ? '#dcfce7' : '#fef3c7';
    const facilityTypeColor = facilityType === 'hospital' ? '#b91c1c' :
                             facilityType === 'clinic' ? '#1e40af' :
                             facilityType === 'pharmacy' ? '#15803d' : '#b45309';

    let starsHtml = '';
    if (rating > 0) {
      for (let i = 0; i < 5; i++) {
        const starColor = i < Math.floor(rating) ? '#fbbf24' : '#d1d5db';
        starsHtml += `<span style="color: ${starColor}; font-size: 14px;">★</span>`;
      }
    }

    const distanceText = distance ? `${distance.toFixed(1)} km away` : '';

    return `
      <div style="min-width: 280px; max-width: 320px; font-family: 'Roboto', sans-serif; padding: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937; line-height: 1.3; flex: 1;">${name}</h3>
          ${facilityTypeLabel ? `<span style="display: inline-block; padding: 4px 8px; background-color: ${facilityTypeBg}; color: ${facilityTypeColor}; font-size: 11px; font-weight: 600; border-radius: 4px; white-space: nowrap; margin-left: 8px;">${facilityTypeLabel.toUpperCase()}</span>` : ''}
        </div>
        
        ${distanceText ? `<div style="margin-bottom: 12px; padding: 8px; background-color: #f0fdf4; border-left: 3px solid #22c55e; border-radius: 4px; font-size: 12px; color: #15803d; font-weight: 500;">📍 ${distanceText}</div>` : ''}
        
        <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280; line-height: 1.6;">
          <div style="margin-bottom: 6px; display: flex; align-items: flex-start; gap: 6px;">
            <span style="font-size: 14px; margin-top: 2px;">📍</span>
            <span>${address}</span>
          </div>
          <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 14px;">📞</span>
            <a href="tel:${phone}" style="color: #667eea; text-decoration: none; font-weight: 500;">${phone}</a>
          </div>
        </div>
        ${rating > 0 ? `
        <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 2px;">
            ${starsHtml}
          </div>
          <span style="font-size: 13px; color: #6b7280; font-weight: 500;">${rating.toFixed(1)}</span>
          ${ratingCount > 0 ? `<span style="font-size: 12px; color: #9ca3af;">(${ratingCount} reviews)</span>` : ''}
        </div>
        ` : ''}
        <div style="margin-bottom: 12px;">
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; background-color: ${statusColor}15; color: ${statusColor}; font-size: 13px; font-weight: 500;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${statusColor}; display: inline-block;"></span>
            ${statusText}
          </span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${placeId ? `<button onclick="window.openDirections('${placeId}', '${name.replace(/'/g, "\\'")}'); return false;" style="flex: 1; padding: 8px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: transform 0.2s; min-width: 100px;">📍 Get Directions</button>` : ''}
          ${website ? `<a href="${website}" target="_blank" rel="noopener noreferrer" style="flex: 1; padding: 8px 12px; background-color: #f3f4f6; color: #667eea; text-decoration: none; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 12px; font-weight: 600; text-align: center; min-width: 100px; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#e5e7eb'" onmouseout="this.style.backgroundColor='#f3f4f6'">🌐 Website</a>` : ''}
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;
  };

  // Initialize Google Maps
  useEffect(() => {
    // Expose openDirections globally for info window button clicks
    (window as any).openDirections = openDirections;

    // Expose searchNearbyHealthcare for chatbot integration
    mapComponentRef.current = {
      searchNearbyHealthcare: (facilityFilter: FacilityType = 'all', radius: number = 5000) => {
        setFacilityType(facilityFilter);
        setSearchRadius(radius);
        if (userLocation) {
          searchNearbyFacilities(userLocation);
        } else {
          requestUserLocation();
        }
      }
    };

    (window as any).Map3DSearch = mapComponentRef.current;

    // Function to check and initialize map
    const checkAndInit = () => {
      if (window.google && window.google.maps && mapContainerRef.current && !mapRef.current) {
        initializeMap();
        return true;
      }
      return false;
    };

    // Check if already loaded
    if (checkAndInit()) {
      return;
    }

    // Wait for Google Maps to load
    const checkInterval = setInterval(() => {
      if (checkAndInit()) {
        clearInterval(checkInterval);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      delete (window as any).openDirections;
      delete (window as any).Map3DSearch;
    };
  }, [userLocation]); // Include userLocation so openDirections always has current value

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.google || !window.google.maps) {
      return;
    }

    // Default location (can be changed based on user location)
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // New Delhi, India

    // Create map with 3D tilt
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: defaultLocation,
      zoom: 14,
      tilt: 45, // 3D tilt view
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    mapRef.current = map;
    setMapLoaded(true);

    // Request user location automatically
    requestUserLocation();
  };

  // Handle search update
  const handleUpdateSearch = () => {
    if (userLocation) {
      searchNearbyFacilities(userLocation);
    } else {
      requestUserLocation();
    }
  };

  // Handle facility type change
  useEffect(() => {
    if (userLocation && mapLoaded) {
      searchNearbyFacilities(userLocation);
    }
  }, [facilityType]);

  return (
    <div className="relative h-full w-full bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in max-w-md">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto hover:bg-red-600 rounded p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-[#667eea] animate-spin" />
            <p className="text-gray-700 font-medium">
              {locationPermissionStatus === 'requesting' 
                ? 'Requesting location permission...' 
                : 'Searching for healthcare facilities...'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Control Panel */}
      <div className="absolute top-4 right-4 z-30 bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full md:w-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="text-[#667eea]" size={20} />
          Find Healthcare Facilities
        </h2>

        {/* Marker Legend */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Marker Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Hospitals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Clinics/Doctors</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Pharmacies</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Health Centers</span>
            </div>
          </div>
        </div>

        {/* Facility Type Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facility Type
          </label>
          <select
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value as FacilityType)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 focus:border-[#667eea] transition-all duration-300"
          >
            <option value="all">All Facilities</option>
            <option value="hospital">Hospitals</option>
            <option value="doctor">Clinics/Doctors</option>
            <option value="health">Health Centers</option>
            <option value="pharmacy">Pharmacies</option>
          </select>
        </div>

        {/* Search Radius */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius: {searchRadius}m
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#667eea]"
            />
            <input
              type="number"
              min="500"
              max="50000"
              step="500"
              value={searchRadius}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 500 && value <= 50000) {
                  setSearchRadius(value);
                }
              }}
              className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 focus:border-[#667eea] transition-all"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>500m</span>
            <span>25km</span>
            <span>50km</span>
          </div>
        </div>

        {/* Update Search Button */}
        <button
          onClick={handleUpdateSearch}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Update Search
        </button>

        {/* Results Counter */}
        {facilitiesCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[#667eea]">{facilitiesCount}</span> facilities found
            </p>
          </div>
        )}

        {/* Location Permission Button */}
        {locationPermissionStatus !== 'granted' && locationPermissionStatus !== 'requesting' && (
          <button
            onClick={requestUserLocation}
            className="w-full mt-3 bg-blue-50 text-[#667eea] py-2.5 px-4 rounded-lg font-medium hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-2 border border-[#667eea]/20"
          >
            <Navigation size={18} />
            Use My Location
          </button>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map not loaded message */}
      {!mapLoaded && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-[#667eea] animate-spin mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Loading Google Maps...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map3D;
