<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$friend_username = $_POST['username'];

try {
    // Check if the friend exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$friend_username]);
    $friend = $stmt->fetch();

    if (!$friend) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $friend_id = $friend['id'];

    // Check if a friendship already exists
    $stmt = $pdo->prepare("SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)");
    $stmt->execute([$user_id, $friend_id, $friend_id, $user_id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Friendship already exists or pending']);
        exit;
    }

    // Send friend request
    $stmt = $pdo->prepare("INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, 'pending')");
    $stmt->execute([$user_id, $friend_id]);

    echo json_encode(['success' => true, 'message' => 'Friend request sent']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>