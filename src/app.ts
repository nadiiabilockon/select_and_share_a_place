import axios from "axios";
import { styledMapType } from './mapStyle';

const form = document.querySelector("form")!;
const placeInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "";

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
};

function searchPlaceHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = placeInput.value;

    axios
        .get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
                enteredAddress
            )}&key=${GOOGLE_API_KEY}`
        )
        .then(res => {
            if (res.data.status !== "OK") {
                throw new Error("Could not fetch location!");
            }
            const coordinates = res.data.results[0].geometry.location;

            const map = new google.maps.Map(document.getElementById("map") as Element, {
                center: coordinates,
                zoom: 11,
                mapTypeControlOptions: {
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                        'styled_map']
                }
            });

            map.mapTypes.set('styled_map', styledMapType);
            map.setMapTypeId('styled_map');

            new google.maps.Marker({ position: coordinates, map: map });
        })
        .catch(err => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchPlaceHandler);
