<?php
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../bootstrap_aspen.php';

require_once ROOT_DIR . '/sys/Account/UserNotification.php';
require_once ROOT_DIR . '/sys/Notifications/ExpoNotification.php';

$notification = new UserNotification();
$notification->completed = 0;
$notification->error = 0;
$notification->find();

$numProcessed = 0;

while($notification->fetch()) {
	$expoNotification = new ExpoNotification();
	if(!empty($notification->receiptId)) {
		// expo expects receipt id in an array, even if a single value
		$arr[] = $notification->receiptId;
		$expoNotification->getExpoNotificationReceipt($arr);
		$numProcessed++;
	}
}