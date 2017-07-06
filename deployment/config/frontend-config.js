const config = {
	projectName: "Bosch Thermotechnik Early Warning Dashboard",
	useBackendMock: false,
	basename: '${BASENAME}',
	backendRESTRoute: "${HOST}/api",
	backendWebSocketURL: "${WEBSOCKET_HOST}/notifications",
	enableCaching: true,
	language: "de",
	colors: {
		primaryDark: "#000051",
		primaryDarkAlpha: "rgba(0, 0, 81, 0.2)",
		primary: "#1a237e",
		primaryLight: "#534bae",
		accent: "#C99700",
		accentLight: "#ffc107",
		text: "#424242",
		textAlternate: "#ffffff",
		border: "#e0e0e0",
		toggleOff: '#9E9E9E',
		error: "#B71C1C",
		success: "#558B2F"
	},
    statuses: [
        {
            name:"Keine Fehler",
            color: "#4CAF50",
            colorLight: '#81C784'
        },
        {
            name:"Warnung",
            color: "#FFBF00",
            colorLight: "#F5DA81"
        },
        {
            name:"Error",
            color: "#E53935",
            colorLight: "#E57373"
        },
        {
            name:"UNDEFINED",
            color: "#757575",
            colorLight: "#BDBDBD"
        },
    ],
    eventTableChunkSize: 50,
	notificationDisplayDuration: 7500,
};

export default config;
