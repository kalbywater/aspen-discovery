import { useQueryClient } from '@tanstack/react-query';
import CachedImage from 'expo-cached-image';
import { LinearGradient } from 'expo-linear-gradient';
import _ from 'lodash';
import moment from 'moment';
import { Badge, Box, Heading, ScrollView, Text, useColorModeValue, useToken } from 'native-base';
import React from 'react';

import { DisplaySystemMessage } from '../../components/Notifications';
import { LanguageContext, LibraryBranchContext, LibrarySystemContext, SystemMessagesContext, UserContext } from '../../context/initialContext';
import { getTermFromDictionary } from '../../translations/TranslationService';
import AdditionalInformation from './AdditionalInformation';
import ContactButtons from './ContactButtons';
import DisplayMap from './DisplayMap';
// custom components and helper files
import Hours from './Hours';

export const MyLibrary = () => {
     const { user } = React.useContext(UserContext);
     const { library } = React.useContext(LibrarySystemContext);
     const { location } = React.useContext(LibraryBranchContext);
     const { language } = React.useContext(LanguageContext);
     const [openToday, setOpenToday] = React.useState(false);
     const queryClient = useQueryClient();
     const { systemMessages, updateSystemMessages } = React.useContext(SystemMessagesContext);

     const bgColor = useToken('colors', useColorModeValue('warmGray.50', 'coolGray.800'));
     const showSystemMessage = () => {
          if (_.isArray(systemMessages)) {
               return systemMessages.map((obj, index, collection) => {
                    if (obj.showOn === '0') {
                         return <DisplaySystemMessage style={obj.style} message={obj.message} dismissable={obj.dismissable} id={obj.id} all={systemMessages} url={library.baseUrl} updateSystemMessages={updateSystemMessages} queryClient={queryClient} />;
                    }
               });
          }
          return null;
     };

     let isClosedToday = false;
     let hoursLabel = '';
     let hasHours = false;
     if (location.hours) {
          if (_.size(location.hours) > 0) {
               hasHours = true;
          }
          const day = moment().day();
          if (_.find(location.hours, _.matchesProperty('day', day))) {
               let todaysHours = _.filter(location.hours, { day: day });
               if (todaysHours[0]) {
                    todaysHours = todaysHours[0];
                    if (todaysHours.isClosed) {
                         isClosedToday = true;
                         hoursLabel = getTermFromDictionary(language, 'location_closed');
                    } else {
                         const closingText = todaysHours.close;
                         const time1 = closingText.split(':');
                         const openingText = todaysHours.open;
                         const time2 = openingText.split(':');
                         const closeTime = moment().set({ hour: time1[0], minute: time1[1] });
                         const openTime = moment().set({ hour: time2[0], minute: time2[1] });
                         const nowTime = moment();
                         const stillOpen = moment(nowTime).isBefore(closeTime);
                         const stillClosed = moment(openTime).isBefore(nowTime);
                         if (!stillOpen) {
                              isClosedToday = true;
                              hoursLabel = getTermFromDictionary(language, 'location_closed');
                         }
                         if (!stillClosed) {
                              isClosedToday = true;
                              let openingTime = moment(openTime).format('h:mm A');
                              hoursLabel = 'Closed until ' + openingTime;
                         } else {
                              isClosedToday = false;
                              let closingTime = moment(closeTime).format('h:mm A');
                              hoursLabel = 'Open until ' + closingTime;
                         }
                    }
               }
          }
     }

     const key = 'location_' + location.locationId;

     return (
          <ScrollView>
               {location.locationImage ? (
                    <>
                         <LinearGradient height={200} width="100%" locations={[0.45, 1]} colors={['transparent', bgColor]} zIndex={0} position="absolute" left={0} top={0} />
                         <CachedImage
                              cacheKey={key}
                              alt={location.displayName}
                              source={{ uri: location.locationImage, expiresIn: 86400 }}
                              resizeMode="cover"
                              style={{
                                   width: '100%',
                                   height: 200,
                                   borderRadius: 4,
                                   zIndex: -1,
                                   position: 'absolute',
                                   left: 0,
                                   top: 0,
                              }}
                              placeholderContent={
                                   <Box
                                        bg={bgColor}
                                        _dark={{
                                             bgColor: 'coolGray.800',
                                        }}
                                        width={{
                                             base: '100%',
                                        }}
                                        height={{
                                             base: 200,
                                        }}
                                   />
                              }
                         />
                    </>
               ) : null}
               <Box safeArea={5} mt={location.locationImage ? 40 : 0}>
                    {showSystemMessage()}
                    {library.displayName !== location.displayName ? <Heading mb={2}>{location.displayName}</Heading> : <Heading mb={1}>{library.displayName}</Heading>}
                    {location.address ? <Text>{location.address}</Text> : null}
                    {location.phone ? (
                         <Text>
                              {getTermFromDictionary(language, 'phone')}: {location.phone}
                         </Text>
                    ) : null}
                    {hasHours ? (
                         <Text mt={4} mb={2}>
                              <Badge colorScheme={isClosedToday ? 'error' : 'success'}>{hoursLabel}</Badge>
                         </Text>
                    ) : null}
                    <DisplayMap />
                    <ContactButtons />
                    {hasHours ? <Hours /> : null}
                    <AdditionalInformation />
               </Box>
          </ScrollView>
     );
};