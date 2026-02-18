import cv2
from ultralytics import YOLO

# ====== CHANGE THESE PATHS ======
INPUT_VIDEO = "C:/gaming app/lag_skill_analyzer/backend/uploads/video2.mp4"
OUTPUT_VIDEO = "C:/gaming app/lag_skill_analyzer/backend/outputs/annotated1.mp4"
# =================================

# Create output directory if not exists
import os
os.makedirs(os.path.dirname(OUTPUT_VIDEO), exist_ok=True)

# Load YOLOv8 model
model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(INPUT_VIDEO)
if not cap.isOpened():
    print("Error: Could not open input video")
    exit()

# Get video properties
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

print("Video:", width, "x", height, "@", fps, "FPS")

# Video writer
fourcc = cv2.VideoWriter_fourcc(*"mp4v")
out = cv2.VideoWriter(OUTPUT_VIDEO, fourcc, fps, (width, height))

frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # Run YOLO on frame
    results = model(frame, verbose=False)

    # Draw boxes
    for r in results:
        if r.boxes is not None:
            for box, cls, conf in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.conf):
                if int(cls) == 0:  # 0 = person class
                    x1, y1, x2, y2 = map(int, box)
                    label = f"Person {conf:.2f}"

                    # Draw rectangle
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    # Draw label
                    cv2.putText(
                        frame,
                        label,
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        (0, 255, 0),
                        2,
                    )

    out.write(frame)

    if frame_count % 30 == 0:
        print(f"Processed frame {frame_count}")

cap.release()
out.release()

print("Done!")
print("Saved annotated video to:", OUTPUT_VIDEO)
