<?php
/** @noinspection PhpUnused */
function getUpdates22_08_00() : array
{
	return [
		/*'name' => [
			'title' => '',
			'description' => '',
			'sql' => [
				''
			]
		], //sample*/
		'account_profile_oauth_client_secret_length' => [
			'title' => 'Adjust length for oAuth Client Secret in Account Profile',
			'description' => 'Adjust length for oAuth Client Secret in Account Profile',
			'sql' => [
				"ALTER TABLE account_profiles CHANGE COLUMN oAuthClientSecret oAuthClientSecret VARCHAR(50)",
			]
		], //account_profile_oauth_client_secret_length
		'greenhouse_wait_time_monitoring' => [
			'title' => 'Wait Time monitoring in Greenhouse',
			'description' => 'Add tracking of wait time within the Greenhouse',
			'sql' => [
				'CREATE TABLE IF NOT EXISTS aspen_site_wait_time (
					id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
					aspenSiteId INT(11) NOT NULL,
					waitTime FLOAT NOT NULL,
					timestamp INT(11),
					UNIQUE (aspenSiteId, timestamp)
				) ENGINE INNODB',
			]
		],//greenhouse wait time monitoring
		'add_displayHoldsOnCheckout' => [
			'title' => 'Add displayHoldsOnCheckout option to library systems',
			'description' => 'Add option to show if patron checkouts have holds on them',
			'sql' => [
				"ALTER TABLE library ADD COLUMN displayHoldsOnCheckout TINYINT(1) DEFAULT 0"
			]
		],//add_displayHoldsOnCheckout
	];
}