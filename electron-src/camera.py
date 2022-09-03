"""
カメラの起動から、集中力などへの変換。返すところまで
全てこのpythonファイルにまとめちゃいました。
関数切り分けはしてるので許して
"""

#オプション-----------------------------------------------------------------------------
#wait = 100 #画像一枚処理するごとに何秒間まつか（ms）。ゼロ以外を指定。
gap = 3 #どれだけの猫背を許容するか。大きいほうが緩い。(鼻ー胸距離の[gap]倍が肩幅以下なら猫背と判定)
#-------------------------------------------------------------------------------------


import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose
import cv2
import base64
import numpy as np
import sys 



# def main(s):
#     ans = {}
#     is_cat = False 

#     poses = detect(s)
#     chest_y = (poses["L_SHOULDER"][1] + poses["R_SHOULDER"][1])/2 
#     nose_y = poses["NOSE"][1]
#     chest_width = abs(poses["L_SHOULDER"][0] - poses["R_SHOULDER"][0])


#     if abs(chest_y - nose_y)*gap < chest_width:
#         is_cat = True 

#     ans["is_cat"] = is_cat
#     print(ans)




    
def from_base64(s):
    base64_data = base64(s)
    nparr = np.fromstring(base64_data.decode('base64'), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_ANYCOLOR)

    return img

def detect(output=False):
    print("detect",file=sys.stderr )
    # print("detect" ,file=sys.stderr)
    s = ""
    while True:
        t = sys.stdin.readline(1024)
        s += t
        if len(t) < 1024:
            break

    # print(s)
    # s = s.split(';')[1]
    print("input done!" ,file=sys.stderr)
    print(f's:{s[:20]}', file=sys.stderr)
    jpg_original = base64.b64decode(s[22:].encode())
    with open ('out.txt',mode='w') as f:
        f.write(s[22:])

    jpg_as_np = np.frombuffer(jpg_original, dtype=np.uint8)
    print(jpg_as_np.shape, file=sys.stderr )
    image = cv2.imdecode(jpg_as_np, flags=1)

    image_y,image_x,_ = image.shape
    # For webcam input:
    with mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as pose:

            # To improve performance, optionally mark the image as not writeable to
            # pass by reference.
            image.flags.writeable = False
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image)

            if output:

                # Draw the pose annotation on the image.
                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                mp_drawing.draw_landmarks(
                    image,
                    results.pose_landmarks,
                    mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
                cv2.imwrite('out.png',image) 

            #{体の部位：座標}として返す
            ans = {}

            if results.pose_landmarks:
                
            #mediapipeで座標を取り出すのが少し大変なので、取り出す時に必要なキーをまとめて書いとく
                landmark_dic = {"NOSE":mp_pose.PoseLandmark.NOSE,
                    "L_SHOULDER":mp_pose.PoseLandmark.LEFT_SHOULDER,
                    "R_SHOULDER":mp_pose.PoseLandmark.RIGHT_SHOULDER,
                }

                for name,point in landmark_dic.items():
                    try:
                        ans[name] = [results.pose_landmarks.landmark[point].x * image_x,
                                    results.pose_landmarks.landmark[point].y * image_y]
                    except KeyError:
                        ans[name] = None 

                # print(vars(mp_pose.PoseLandmark))
                # print(mp_pose.PoseLandmark._member_names_)

            # print(ans)
            # Flip the image horizontally for a selfie-view display.
            return ans


def test():
    print("test")


print(detect(output=True))
exit()
