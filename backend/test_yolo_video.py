import cv2
from ultralytics import YOLO

# Path to your recorded gameplay video
VIDEO_PATH = "C:/gaming app/lag_skill_analyzer/backend/uploads/video2.mp4"

# Load YOLOv8 nano (fast, good for demo)
model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    print("Error: Could not open video")
    exit()

frame_count = 0
total_persons = 0
max_persons_in_frame = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # Run detection on this frame
    results = model(frame, verbose=False)

    # Count "person" detections (class 0 in COCO is person)
    persons_in_frame = 0
    for r in results:
        if r.boxes is not None:
            for cls in r.boxes.cls:
                if int(cls) == 0:  # 0 = person
                    persons_in_frame += 1

    total_persons += persons_in_frame
    max_persons_in_frame = max(max_persons_in_frame, persons_in_frame)

    # Print sometimes to see progress
    if frame_count % 30 == 0:
        print(f"Frame {frame_count}: persons = {persons_in_frame}")

cap.release()

if frame_count > 0:
    avg_persons = total_persons / frame_count
else:
    avg_persons = 0

print("=== Results ===")
print("Total frames:", frame_count)
print("Average persons per frame:", round(avg_persons, 2))
print("Max persons in a frame:", max_persons_in_frame)
