<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // Get user information
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    // Get friends list
    $stmt = $pdo->prepare("
        SELECT u.id, u.username
        FROM users u
        JOIN friendships f ON (f.user_id = ? AND f.friend_id = u.id) OR (f.friend_id = ? AND f.user_id = u.id)
        WHERE f.status = 'accepted'
    ");
    $stmt->execute([$user_id, $user_id]);
    $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get notification count
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM friendships WHERE friend_id = ? AND status = 'pending'");
    $stmt->execute([$user_id]);
    $notificationCount = $stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'username' => $user['username'],
        'friends' => $friends,
        'notificationCount' => $notificationCount
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>