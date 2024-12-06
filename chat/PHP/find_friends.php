<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE id != ?");
    $stmt->execute([$user_id]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'users' => $users]);
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $friend_id = $_POST['friend_id'];
    $stmt = $pdo->prepare("INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)");
    $stmt->execute([$user_id, $friend_id]);
    echo json_encode(['success' => true, 'message' => "Friend request sent"]);
}
?>