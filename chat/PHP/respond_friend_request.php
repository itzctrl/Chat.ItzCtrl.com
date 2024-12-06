<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$notification_id = $_POST['notification_id'];
$accept = $_POST['accept'];

try {
    if ($accept) {
        $stmt = $pdo->prepare("UPDATE friendships SET status = 'accepted' WHERE id = ? AND friend_id = ?");
        $stmt->execute([$notification_id, $user_id]);
        $message = 'Friend request accepted';
    } else {
        $stmt = $pdo->prepare("DELETE FROM friendships WHERE id = ? AND friend_id = ?");
        $stmt->execute([$notification_id, $user_id]);
        $message = 'Friend request declined';
    }

    echo json_encode(['success' => true, 'message' => $message]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>