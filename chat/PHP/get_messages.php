<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id']) || !isset($_GET['friend_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$user_id = $_SESSION['user_id'];
$friend_id = $_GET['friend_id'];
$last_id = isset($_GET['last_id']) ? intval($_GET['last_id']) : 0;

try {
    $stmt = $pdo->prepare("
        SELECT m.*, u.username as from_username
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE ((m.sender_id = :user_id AND m.receiver_id = :friend_id) 
            OR (m.sender_id = :friend_id AND m.receiver_id = :user_id))
        AND m.id > :last_id
        ORDER BY m.sent_at ASC
    ");
    
    $stmt->execute([
        ':user_id' => $user_id,
        ':friend_id' => $friend_id,
        ':last_id' => $last_id
    ]);
    
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'messages' => $messages]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>