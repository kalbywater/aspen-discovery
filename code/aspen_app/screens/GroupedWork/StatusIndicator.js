import React, {useState} from "react";
import {Badge, Button, Center, FormControl, HStack, Modal, Radio, Text, VStack} from "native-base";

// custom components and helper files
import {translate} from '../../util/translations';
import {checkoutItem, openSideLoad, overDriveSample, placeHold} from "../../util/recordActions";

const StatusIndicator = (props) => {

	let badgeColor;
	const {data, format, language, locations, showAlert, openCheckouts} = props;
	const arrayToSearch = data.[`${format}`];

	const locationCount = locations.length;

	let match = arrayToSearch.filter(function (item) {
		return (item.format === format);
	});

	match = match.filter(function (item) {
		return (item.language === language);
	});

	if (match.length === 0) {

		return (
			<Center>
				<VStack mt={5} mb={0} bgColor="white" _dark={{ bgColor: "coolGray.900" }} p={3} rounded="8px" alignItems="center"
				        width={{base: "100%", lg: "75%"}}>
					<Text bold textAlign="center">{translate('grouped_work.no_matches', {
						language: language,
						format: format
					})}</Text>
				</VStack>
			</Center>
		);
	}

	if (match.length === 1) {
		const status = match[0].status;
		const available = match[0].available;
		const availableOnline = match[0].availableOnline;
		const action = match[0].action.title;
		const actionType = match[0].action.type;
		const actions = match[0].action;
		const id = match[0].id;
		const source = match[0].source;
		const copiesMessage = match[0].copiesMessage;

		const location = match[0].shelfLocation;
		const callNumber = match[0].callNumber;
		const eContent = match[0].isEContent;

		const edition = match[0].edition;
		const publisher = match[0].publisher;
		const publicationDate = match[0].publicationDate;

		if (available === true || availableOnline === true) {
			badgeColor = "success";
		} else {
			badgeColor = "danger";
		}

		return (
			<Center>
				<HStack justifyContent="space-around" mt={5} bgColor="white" _dark={{ bgColor: "coolGray.900" }} p={3} rounded="8px"
				        alignItems="center" width={{base: "100%", lg: "75%"}} space={2} flex={1}>
					<VStack space={1} alignItems="center" w="40%" flex={1}>
						<Badge colorScheme={badgeColor} rounded="4px" _text={{fontSize: 14}} mb={.5}>{status}</Badge>
						{source === "ils" ? <><Text fontSize={{base: "sm", lg: "lg"}} color="muted.500" mt={-.5}
						                            textAlign="center">{location ?
							<Text fontSize={{base: "sm", lg: "lg"}}
							      bold>{location}{"\n"}</Text> : null} {callNumber}</Text></> : null}
						{copiesMessage !== "" ? <><Text fontSize={{base: "xs", lg: "xs"}} color="muted.400"
						                                textAlign="center">{copiesMessage}</Text></> : null}
					</VStack>
					<Button.Group direction="column" alignItems="center" flex={1}>
						{actions.map((action) => {
							if (action.type === "overdrive_sample") {
								return (
									<Button size={{base: "xs", lg: "sm"}} colorScheme="primary" variant="outline"
									        _text={{padding: 0, textAlign: "center", fontSize: 12}}
									        style={{flex: 1, flexWrap: 'wrap'}}
									        onPress={() => doAction(id, action.type, global.patronId, action.formatId, action.sampleNumber)}>{action.title}</Button>
								)
							} else if (action.type === "ils_hold" && locationCount > 1) {
								/* Open pickup location modal */
								if (locationCount > 1) {
									return (
										<SelectPickupLocation locations={locations} label={action.title}
										                      action={action.type} record={id} patron={global.patronId}
										                      showAlert={showAlert}/>
									)
								} else {
									return (
										<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
										        _text={{padding: 0, textAlign: "center"}}
										        style={{flex: 1, flexWrap: 'wrap', alignSelf: "flex-start"}}
										        onPress={async () => {
											        await doAction(id, action.type, global.patronId, locations[0].key).then(response => {
												        showAlert(response)
											        })
										        }}>{action.title}</Button>
									);
								}
							} else if (action.title === "Access Online") {
								/* Open in browser window */
								return (
									<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
									        _text={{padding: 0, textAlign: "center"}}
									        style={{flex: 1, flexWrap: 'wrap'}} onPress={async () => {
										openSideLoad(action.url)
									}}>{action.title}</Button>
								)
							} else if (action.title === "Checked Out to You") {
								return (
									<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
									        _text={{padding: 0, textAlign: "center"}}
									        style={{flex: 1, flexWrap: 'wrap'}} onPress={() => {
										openCheckouts()
									}}>{action.title}</Button>
								)
							} else {
								return (
									<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
									        _text={{padding: 0, textAlign: "center"}}
									        style={{flex: 1, flexWrap: 'wrap'}} onPress={async () => {
										await doAction(id, action.type, global.patronId).then(response => {
											showAlert(response)
										})
									}}>{action.title}</Button>
								);
							}
						})}
					</Button.Group>
				</HStack>
			</Center>
		)
	}

	if (match.length > 1) {
		return match.map((item, index) => {
			let badgeColor;
			if (item.available === true || item.availableOnline === true) {
				badgeColor = "success";
			} else {
				badgeColor = "danger";
			}
			const actions = item.action;

			return (
				<Center>
					<HStack justifyContent="space-around" mt={5} mb={0} bgColor="white" _dark={{ bgColor: "coolGray.900" }} p={3} rounded="8px" shadow={1}
					        alignItems="center" width={{base: "100%", lg: "75%"}} space={2} flex={1}>
						<VStack space={1} alignItems="center" w="40%" flex={1}>
							<Badge colorScheme={badgeColor} rounded="4px" _text={{fontSize: 14,}}>{item.status}</Badge>
							{item.source === "ils" ? <><Text fontSize={{base: "sm", lg: "lg"}} color="muted.500"
							                                 mt={-.5}>{item.shelfLocation ?
								<Text fontSize={{base: "sm", lg: "lg"}}
								      bold>{item.shelfLocation}{"\n"}</Text> : null} {item.callNumber}</Text></> : null}
							{item.publicationDate ? <Text fontSize={{base: "xs", lg: "xs"}}
							                              color="muted.600">{item.publicationDate}</Text> : null}
							{item.copiesMessage !== "" ? <><Text fontSize={{base: "xs", lg: "xs"}} color="muted.400"
							                                     textAlign="center">{item.copiesMessage}</Text></> : null}
						</VStack>
						<Button.Group direction="column" alignItems="center" flex={1}>
							{actions.map((action) => {
								if (action.type === "overdrive_sample") {
									return (
										<Button size={{base: "xs", lg: "sm"}} colorScheme="primary" variant="outline"
										        _text={{padding: 0, textAlign: "center", fontSize: 12}}
										        style={{flex: 1, flexWrap: 'wrap'}}
										        onPress={() => doAction(item.id, action.type, global.patronId, action.formatId, action.sampleNumber)}>{action.title}</Button>
									)
								} else if (action.type === "ils_hold") {
									/* Open pickup location modal */
									if (locationCount > 1) {
										return (
											<SelectPickupLocation locations={locations} label={action.title}
											                      action={action.type} record={item.id}
											                      patron={global.patronId} showAlert={showAlert}/>
										)
									} else {
										return (
											<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
											        _text={{padding: 0, textAlign: "center"}}
											        style={{flex: 1, flexWrap: 'wrap'}} onPress={async () => {
												await doAction(item.id, action.type, global.patronId, locations[0].key).then(response => {
													showAlert(response)
												})
											}}>{action.title}</Button>
										);
									}
								} else if (action.title === "Access Online") {
									/* Open in browser window */
									return (
										<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
										        _text={{padding: 0, textAlign: "center"}}
										        style={{flex: 1, flexWrap: 'wrap'}} onPress={async () => {
											openSideLoad(action.url)
										}}>{action.title}</Button>
									)
								} else if (action.title === "Checked Out to You") {
									return (
										<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
										        _text={{padding: 0, textAlign: "center"}}
										        style={{flex: 1, flexWrap: 'wrap'}} onPress={() => {
											openCheckouts()
										}}>{action.title}</Button>
									)
								} else {
									return (
										<Button size={{base: "md", lg: "lg"}} colorScheme="primary" variant="solid"
										        _text={{padding: 0, textAlign: "center"}}
										        style={{flex: 1, flexWrap: 'wrap'}} onPress={async () => {
											await doAction(item.id, action.type, global.patronId).then(response => {
												showAlert(response)
											})
										}}>{action.title}</Button>
									);
								}
							})}
						</Button.Group>
					</HStack>
				</Center>
			)
		})
	}
}

async function doAction(id, actionType, patronId, formatId = null, sampleNumber = null, pickupBranch = null) {
	const recordId = id.split(":");
	const source = recordId[0];
	const itemId = recordId[1];

	if (actionType.includes("checkout")) {
		return await checkoutItem(itemId, source, patronId);
	} else if (actionType.includes("hold")) {

		if (!global.overdriveEmail && global.promptForOverdriveEmail === 1 && source === "overdrive") {
			const getPromptForOverdriveEmail = [];
			getPromptForOverdriveEmail['getPrompt'] = true;
			getPromptForOverdriveEmail['itemId'] = itemId;
			getPromptForOverdriveEmail['source'] = source;
			getPromptForOverdriveEmail['patronId'] = patronId;
			getPromptForOverdriveEmail['overdriveEmail'] = global.overdriveEmail;
			getPromptForOverdriveEmail['promptForOverdriveEmail'] = global.promptForOverdriveEmail;
			return getPromptForOverdriveEmail;
		} else {
			return await placeHold(itemId, source, patronId, pickupBranch);
		}

	} else if (actionType.includes("sample")) {
		return await overDriveSample(formatId, itemId, sampleNumber);
	}
}

const SelectPickupLocation = (props) => {

	const {locations, label, action, record, patron, showAlert} = props;

	const [showModal, setShowModal] = useState(false);
	let [value, setValue] = React.useState("");

	return (
		<>
			<Button onPress={() => setShowModal(true)} colorScheme="primary" size="md">{label}</Button>
			<Modal isOpen={showModal} onClose={() => setShowModal(false)} closeOnOverlayClick={false}>
				<Modal.Content>
					<Modal.CloseButton/>
					<Modal.Header>{label}</Modal.Header>
					<Modal.Body>
						<FormControl>
							<FormControl.Label>{translate('pickup_locations.text')}</FormControl.Label>
							<Radio.Group
								name="pickupLocations"
								value={value}
								onChange={(nextValue) => {
									setValue(nextValue);
								}}
								mt="1"
							>
								{locations.map((item, index) => {
									return <Radio value={item.code} my={1}>{item.name}</Radio>;
								})}
							</Radio.Group>
						</FormControl>
					</Modal.Body>
					<Modal.Footer>
						<Button.Group space={2} size="md">
							<Button colorScheme="muted" variant="outline"
							        onPress={() => setShowModal(false)}>{translate('general.close_window')}</Button>
							<Button
								onPress={async () => {
									await doAction(record, action, patron, "", "", value).then(response => {
										showAlert(response)
									});
									setShowModal(false);
								}}
							>
								{label}
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	)
}

export default StatusIndicator;