import { Button, Flex, TextArea } from "@fluentui/react-northstar";

import { booleanToString } from "../../helpers";
import { geoLocation } from "@microsoft/teams-js";
import { useState } from "react";

/**
 * This component check if the user has granted permission to access their location,
 * request permission to access the user's location and get the user's location.
 */
export const GeoLocation = () => {
    const [text, setText] = useState("");
    const [showText, setShowText] = useState(false);
    // check to see if capability is supported
    // this isn't released yet, so it's not surprising that it doesn't work
    if (geoLocation.isSupported()) {
        return (
            <Flex gap="gap.small" vAlign="center">
                <Button onClick={async () => {
                    // check if the user has granted permission to access their location
                    const hasPerms = await geoLocation.hasPermission();
                    setText(hasPerms ? 'Have permission' : 'Do not have permission');
                    setShowText(true);
                    console.log(`GeoLocation: ${hasPerms}`);
                }}>
                    Has Permission
                </Button>
                <Button onClick={async () => {
                    // request permission to access the user's location
                    const hasConsent = await geoLocation.requestPermission();
                    setText(hasConsent ? 'Has Consent' : 'Do not have Consent');
                    setShowText(true);
                    console.log(`GeoLocation consented: ${hasConsent}`);
                }}>
                    Request Permission
                </Button>
                <Button onClick={async () => {
                    // get the user's location
                    try {
                        const location = await geoLocation.getCurrentLocation();
                        console.log(`GeoLocation consented: ${location}`);
                        console.log(`GeoLocation accuracy: ${location.accuracy}`);
                        console.log(`GeoLocation longitude: ${location.longitude}`);
                        console.log(`GeoLocation latitude: ${location.latitude}`);
                        const text = `GeoLocation consented: ${location ? true : false} \n GeoLocation accuracy: ${location.accuracy}\n GeoLocation longitude: ${location.longitude}\n GeoLocation latitude: ${location.latitude}`;
                        setText(text);
                        setShowText(true);
                    } catch (e) {
                        console.log(`GeoLocation error: ${e}`);
                    }
                }}>
                    Get Location
                </Button>
                {geoLocation.map.isSupported() &&
                    <>
                        <Button onClick={async () => {
                            try {
                                await geoLocation.map.chooseLocation()
                            } catch (e) {
                                console.log(`GeoLocation error: ${e}`);
                            }
                        }}>
                            Map: Choose Location
                        </Button>
                        <Button onClick={async () => {
                            try {
                                const location = await geoLocation.getCurrentLocation();
                                await geoLocation.map.showLocation(location);
                            } catch (e) {
                                console.log(`GeoLocation error: ${e}`);

                            }
                        }}>
                            Map: Show Location
                        </Button>
                    </>
                }
                {showText &&
                    <TextArea className="ui_location" inverted value={text} />
                }
            </Flex>
        )
    };
    // return's  if capability is not supported.
    return (<>Capability is not supported</>);
}

export const GeoLocationIsSupported = () => booleanToString(geoLocation.isSupported());