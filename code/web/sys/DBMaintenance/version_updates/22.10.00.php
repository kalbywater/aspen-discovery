<?php
/** @noinspection PhpUnused */
function getUpdates22_10_00() : array
{
	$curTime = time();
	return [
		/*'name' => [
			'title' => '',
			'description' => '',
			'sql' => [
				''
			]
        ], //sample*/


		//mark
		'indexing_profile_statusesToSuppressLength' => [
			'title' => 'Increase the length of statuses to suppress',
			'description' => 'Increase the length of statuses to suppress',
			'sql' => [
				'ALTER TABLE indexing_profiles CHANGE COLUMN statusesToSuppress statusesToSuppress varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL'
			]
		], //indexing_profile_statusesToSuppressLength
		'indexing_profile_record_linking' => [
			'title' => 'Indexing Profile - Record Linking',
			'description' => 'Add toggle to process record linking',
			'sql' => [
				'ALTER TABLE indexing_profiles ADD COLUMN processRecordLinking TINYINT(1) DEFAULT 0'
			]
		], //indexing_profile_record_linking
		'record_parents' => [
			'title' => 'Record Parents',
			'description' => 'Add a table to define parents for a record',
			'sql' => [
				'CREATE TABLE IF NOT EXISTS record_parents(
					id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
					childRecordId VARCHAR(50) collate utf8_bin,
					parentRecordId VARCHAR(50) collate utf8_bin,
					UNIQUE (childRecordId, parentRecordId)
				) ENGINE INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
			]
		], //record_parents
//		'add_childRecords_more_details_section' => [
//
//		], //add_childRecords_more_details_section

		//kirstien
		'aci_speedpay_sdk_config' => [
			'title' => 'Add SDK settings for ACI Speedpay',
			'description' => 'Add SDK settings for ACI Speedpay integration',
			'continueOnError' => true,
			'sql' => array(
				"ALTER TABLE aci_speedpay_settings ADD COLUMN sdkClientId VARCHAR(100)",
				"ALTER TABLE aci_speedpay_settings ADD COLUMN sdkClientSecret VARCHAR(100)",
				"ALTER TABLE aci_speedpay_settings ADD COLUMN sdkApiAuthKey VARCHAR(100)"
			),
		], //aci_speedpay_sdk_config
		'create_lida_notifications' => [
			'title' => 'Add LiDA Notifications',
			'description' => 'Setup tables to allow custom notifications to LiDA users by library/location and patron type',
			'continueOnError' => true,
			'sql' => [
				'CREATE TABLE IF NOT EXISTS aspen_lida_notifications (
					id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
					title VARCHAR(75) NOT NULL,
					message VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
					sendOn INT(11),
					expiresOn INT(11),
					ctaUrl VARCHAR(500) DEFAULT NULL,
					ctaLabel VARCHAR(25) DEFAULT NULL,
					sent INT(1) DEFAULT 0
				) ENGINE INNODB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
				'CREATE TABLE IF NOT EXISTS aspen_lida_notifications_library (
					id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
					lidaNotificationId INT(11),
					libraryId INT(11)
				) ENGINE INNODB',
				'CREATE TABLE IF NOT EXISTS aspen_lida_notifications_location (
					id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
					lidaNotificationId INT(11),
					locationId INT(11)
				) ENGINE INNODB',
				'CREATE TABLE IF NOT EXISTS aspen_lida_notifications_ptype (
					id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
					lidaNotificationId INT(11),
					patronTypeId INT(11)
				) ENGINE INNODB',
				"INSERT INTO permissions (sectionName, name, requiredModule, weight, description) VALUES ('Aspen LiDA', 'Send Notifications', '', 6, 'Controls if the user can send notifications to Aspen LiDA users.</em>')",
				"INSERT INTO role_permissions(roleId, permissionId) VALUES ((SELECT roleId from roles where name='opacAdmin'), (SELECT id from permissions where name='Send Notifications'))",
			]
		], //create_lida_notifications
		'add_notifyCustom' => [
			'title' => 'Add notifyCustom to notification settings',
			'description' => 'Add option to enable custom alerts in notification settings',
			'sql' => [
				'ALTER TABLE aspen_lida_notification_setting ADD COLUMN notifyCustom TINYINT(1) DEFAULT 0'
			]
		], //add_notifyCustom
		'add_userAlertPreferences' => [
			'title' => 'Add notification type preferences to token',
			'description' => 'Allow user to turn on/off specific notification types tied to device push token',
			'sql' => [
				'ALTER TABLE user_notification_tokens ADD COLUMN notifySavedSearch TINYINT(1) DEFAULT 0',
				'ALTER TABLE user_notification_tokens ADD COLUMN notifyCustom TINYINT(1) DEFAULT 0'
			]
		], //add_userAlertPreferences
		'update_userAlertPreferences' => [
			'title' => 'Update users to allow saved search notifications',
			'description' => 'Update existing rows in user_notification_tokens to allow notifications on saved searches',
			'sql' => [
				'UPDATE user_notification_tokens SET notifySavedSearch = 1',
			]
		], //update_userAlertPreferences
		'add_imgOptions' => [
			'title' => 'Add additional options for web builder image cells',
			'description' => 'Add options to enable click to enlarge and provide alt text',
			'continueOnError' => true,
			'sql' => array(
				"ALTER TABLE web_builder_portal_cell ADD COLUMN imgAction TINYINT(1) DEFAULT 0",
				"ALTER TABLE web_builder_portal_cell ADD COLUMN imgAlt VARCHAR(255)",
			),
		], //add_imgOptions
		'add_batchDeletePermissions' => [
			'title' => 'Add batchDelete permission',
			'description' => 'Add permissions to allow users to batch delete objects',
			'continueOnError' => true,
			'sql' => array(
				"INSERT INTO permissions (sectionName, name, requiredModule, weight, description) VALUES ('System Administration', 'Batch Delete', '', 6, 'Controls if the user is able to batch delete.</em>')",
				"INSERT INTO role_permissions(roleId, permissionId) VALUES ((SELECT roleId from roles where name='opacAdmin'), (SELECT id from permissions where name='Batch Delete'))",
			),
		], //add_batchDeletePermissions

		//kodi

		//other

	];
}