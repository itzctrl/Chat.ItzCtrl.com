<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

$stmt = $pdo->prepare("SELECT * FROM friendships WHERE (user_id = ? OR friend_id = ?) AND status = 'accepted'");
$stmt->execute([$user_id, $user_id]);
$friends = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h2>Welcome, <?php echo htmlspecialchars($user['username']); ?></h2>
        <a href="logout.php">Logout</a>
        <h3>Friends</h3>
        <ul>
            <?php foreach ($friends as $friend): ?>
                <?php
                $friend_id = ($friend['user_id'] == $user_id) ? $friend['friend_id'] : $friend['user_id'];
                $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
                $stmt->execute([$friend_id]);
                $friend_name = $stmt->fetchColumn();
                ?>
                <li><a href="chat.php?friend_id=<?php echo $friend_id; ?>"><?php echo htmlspecialchars($friend_name); ?></a></li>
            <?php endforeach; ?>
        </ul>
        <a href="find_friends.php">Find Friends</a>
    </div>
</body>
</html>