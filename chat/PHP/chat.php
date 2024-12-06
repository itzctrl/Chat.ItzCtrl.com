<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id']) || !isset($_GET['friend_id'])) {
    echo json_encode(['success' => false, 'message' => "Invalid request"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$friend_id = $_GET['friend_id'];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY sent_at ASC");
    $stmt->execute([$user_id, $friend_id, $friend_id, $user_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$friend_id]);
    $friend_name = $stmt->fetchColumn();

    echo json_encode(['success' => true, 'friend_name' => $friend_name, 'messages' => $messages]);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $message = $_POST['message'];
    $stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $friend_id, $message]);
    echo json_encode(['success' => true, 'message' => "Message sent"]);
}
?>