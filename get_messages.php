<?php
header('Content-Type: application/json');
require_once 'database.php';

$sql = "SELECT message, timestamp FROM messages ORDER BY timestamp DESC LIMIT 50";
$result = $conn->query($sql);

$messages = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
}

echo json_encode(array_reverse($messages));
$conn->close();
?>