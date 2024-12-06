<?php
session_start();
require_once 'db_connect.php'; // Make sure to include your database connection file

if (!isset($_SESSION['user_id']) || !isset($_POST['friend_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$user_id = $_SESSION['user_id'];
$friend_id = intval($_POST['friend_id']); // Ensure friend_id is an integer

// Prepare and execute the SQL statement to remove the friendship
$stmt = $pdo->prepare("DELETE FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (friend_id = ? AND user_id = ?)");
if ($stmt->execute([$user_id, $friend_id, $friend_id, $user_id])) {
    echo json_encode(['success' => true, 'message' => "Friend removed successfully."]);
} else {
    echo json_encode(['success' => false, 'message' => "Failed to remove friend."]);
}
?>