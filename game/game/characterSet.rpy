# === 배경 정의 ===
define black = "#000000"
define white = "#ffffff"
image background = "backgrouds/campus_walk_background.png"
image street_background = "backgrouds/street_background.png"
image pub_background = "backgrouds/pub_background.png"
image classroom_background = "backgrouds/classroom_background.png"
image dorm_room_night = "backgrouds/dorm_room_night.png"
image pub_background_2 = "backgrouds/pub_background_2.png"
image pub_background_2_night = "backgrouds/pub_background_2_night.png"
image vending_machine_background = "backgrouds/vending_machine_background.png"
image campus_walk_background = "backgrouds/campus_walk_background.png"
image bench_background = "backgrouds/bench_background.png"
image campus_walk_background_2 = "backgrouds/campus_walk_background.png"
image bbq_background = "backgrouds/bbq_background.png"
image club_room_background = "backgrouds/club_room_background.png"
image dorm_front_night = "backgrouds/dorm_front_night.png"
image night_walk_background = "backgrouds/night_walk_background.png"
image monika_room_dark = "backgrouds/dorm_room_night.png"
image campus_sunset_background = "backgrouds/sunset_walk_background.png"
image dorm_room_morning = "backgrouds/dorm_room_night.png"
image festival_night_background = "backgrouds/night_walk_background.png"
image festival_night_background_2 = "backgrouds/night_walk_background.png"
image literature_house_background = "backgrouds/cafe_background.png"
image photo_zone_background = "backgrouds/goods_shop_background.png"
image dark_alley_background = "backgrouds/dark_alley_background.png"
image cafe_background = "backgrouds/cafe_background.png"
image goods_shop_background = "backgrouds/goods_shop_background.png"
image maid_cafe_background = "backgrouds/maid_cafe_background.png"
image sunset_walk_background = "backgrouds/sunset_walk_background.png"
image classroom_hallway_background = "backgrouds/campus_walk_background.png"
image library_front_background = "backgrouds/campus_walk_background.png"
image sports_field_background = "backgrouds/campus_walk_background.png"
image rooftop_background = "backgrouds/rooftop_background.png"
image library_bench_background = "backgrouds/bench_background.png"
image cafe_background_2 = "backgrouds/cafe_background.png"
image campus_walk_night_background = "backgrouds/night_walk_background.png"
image professor_office_background = "backgrouds/professor_office_background.png"
image building_lobby_background = "backgrouds/campus_walk_background.png"

# === 오디오 정의 ===
init:
    define audio.pjy_giggle = "bgms/pjy_giggle.mp3"
    define audio.lhs_giggle = "bgms/lhs_giggle.mp3"
    define audio.jsk_giggle = "bgms/jsk_giggle.mp3"
    define audio.mnk_giggle = "bgms/mnk_giggle.mp3"
    define audio.pyr_giggle = "bgms/pyr_giggle.mp3"
$ renpy.music.set_volume(1.5, channel='sound')
# === 상수 정의 ===
define X_LEFT   = 0.0
define X_CENTER = 0.5
define X_RIGHT  = 1.0

define Y_TOP    = 0.0
define Y_MID    = 0.0
define Y_BOTTOM = 0.0

# === 포지션 정의 ===
define left_top    = Position(xalign=X_LEFT,   yalign=Y_TOP)
define mid_top     = Position(xalign=X_CENTER, yalign=Y_TOP)
define right_top   = Position(xalign=X_RIGHT,  yalign=Y_TOP)

define left_mid    = Position(xalign=X_LEFT,   yalign=Y_MID)
define center      = Position(xalign=X_CENTER, yalign=Y_MID)
define right_mid   = Position(xalign=X_RIGHT,  yalign=Y_MID)

define left_low    = Position(xalign=X_LEFT,   yalign=Y_BOTTOM)
define mid_low     = Position(xalign=X_CENTER, yalign=Y_BOTTOM)
define right_low   = Position(xalign=X_RIGHT,  yalign=Y_BOTTOM)

# === 연출용 ===
define far_left    = Position(xalign=-0.2,     yalign=Y_BOTTOM)
define far_right   = Position(xalign=1.2,      yalign=Y_BOTTOM)
define center_high = Position(xalign=X_CENTER, yalign=0.3)
define tilt_left   = Position(xalign=0.3,      yalign=Y_MID)
define tilt_right  = Position(xalign=0.7,      yalign=Y_MID)

transform left_low_offset:
    xalign X_LEFT
    yalign Y_BOTTOM
    xoffset -150

transform right_low_offset:
    xalign X_RIGHT
    yalign Y_BOTTOM
    xoffset 150

transform center_offset:
    xalign X_CENTER
    yalign Y_BOTTOM
    xoffset 0 # Default to 0, adjust in scenes as needed

transform bounce:
    yoffset -15
    linear 0.15 yoffset 0
    yoffset 0
    linear 0.15 yoffset -10
    linear 0.15 yoffset 0

#main
define main = Character('서경민', color="#ffffff")

#system
define system = Character('System', color="#000000")

#배율
define zoomNUm = 0.65

# 박주연
define pjy = Character('박주연', color="#f664b4")
image pjy standard = Transform("characterImages/pjy/pjy_standard.png", zoom=zoomNUm)
image pjy shy_1 = Transform("characterImages/pjy/pjy_shy_1.png", zoom=zoomNUm)
image pjy shy_2 = Transform("characterImages/pjy/pjy_shy_2.png", zoom=zoomNUm)
image pjy shy_3 = Transform("characterImages/pjy/pjy_shy_3.png", zoom=zoomNUm)
image pjy shy_4 = Transform("characterImages/pjy/pjy_shy_4.png", zoom=zoomNUm)
image pjy shorked_1 = Transform("characterImages/pjy/pjy_shorked_1.png", zoom=zoomNUm)
image pjy shorked_2 = Transform("characterImages/pjy/pjy_shorked_2.png", zoom=zoomNUm)
image pjy shorked_3 = Transform("characterImages/pjy/pjy_shorked_3.png", zoom=zoomNUm)
image pjy shorked_4 = Transform("characterImages/pjy/pjy_shorked_4.png", zoom=zoomNUm)
image pjy sad_1 = Transform("characterImages/pjy/pjy_sad_1.png", zoom=zoomNUm)
image pjy sad_2 = Transform("characterImages/pjy/pjy_sad_2.png", zoom=zoomNUm)
image pjy joke_1 = Transform("characterImages/pjy/pjy_joke_1.png", zoom=zoomNUm)
image pjy angry_1 = Transform("characterImages/pjy/pjy_angry_1.png", zoom=zoomNUm)
image pjy angry_2 = Transform("characterImages/pjy/pjy_angry_2.png", zoom=zoomNUm)

# 이현서
define lhs = Character('이현서', color="#cad9ff")
image lhs standard = Transform("characterImages/lhs/lhs_standard.png", zoom=zoomNUm)
image lhs shy_1 = Transform("characterImages/lhs/lhs_shy_1.png", zoom=zoomNUm)
image lhs shy_2 = Transform("characterImages/lhs/lhs_shy_2.png", zoom=zoomNUm)
image lhs shorked_1 = Transform("characterImages/lhs/lhs_shorked_1.png", zoom=zoomNUm)
image lhs sad_1 = Transform("characterImages/lhs/lhs_sad_1.png", zoom=zoomNUm)
image lhs sad_2 = Transform("characterImages/lhs/lhs_sad_2.png", zoom=zoomNUm)
image lhs angry_1 = Transform("characterImages/lhs/lhs_angry_1.png", zoom=zoomNUm)

# 정성경
define yuna = Character('유나', color="#E0BBE4")
define jsk = Character('???', color="#fff42d")
image jsk standard = Transform("characterImages/jsk/jsk_standard.png", zoom=zoomNUm)
image jsk shy_1 = Transform("characterImages/jsk/jsk_shy_1.png", zoom=zoomNUm)
image jsk shy_2 = Transform("characterImages/jsk/jsk_shy_2.png", zoom=zoomNUm)
image jsk shy_3 = Transform("characterImages/jsk/jsk_shy_3.png", zoom=zoomNUm)
image jsk shorked_1 = Transform("characterImages/jsk/jsk_shorked_1.png", zoom=zoomNUm)
image jsk shorked_2 = Transform("characterImages/jsk/jsk_shorked_2.png", zoom=zoomNUm)
image jsk sad_1 = Transform("characterImages/jsk/jsk_sad_1.png", zoom=zoomNUm)
image jsk sad_2 = Transform("characterImages/jsk/jsk_sad_2.png", zoom=zoomNUm)
image jsk joke_1 = Transform("characterImages/jsk/jsk_joke_1.png", zoom=zoomNUm)
image jsk joke_2 = Transform("characterImages/jsk/jsk_joke_2.png", zoom=zoomNUm)
image jsk joke_3 = Transform("characterImages/jsk/jsk_joke_3.png", zoom=zoomNUm)
image jsk angry_1 = Transform("characterImages/jsk/jsk_angry_1.png", zoom=zoomNUm)
image jsk angry_2 = Transform("characterImages/jsk/jsk_angry_2.png", zoom=zoomNUm)
image jsk angry_3 = Transform("characterImages/jsk/jsk_angry_3.png", zoom=zoomNUm)

# 김민수
define kms = Character('김민수', color="#74c7a7")

# Monika
define mnk = Character('Monika', color="#ec9aef")
image mnk standard = Transform("characterImages/mnk/mnk_standard.png", zoom=zoomNUm)
image mnk standard_2 = Transform("characterImages/mnk/mnk_standard_2.png", zoom=zoomNUm)
image mnk shorked_1 = Transform("characterImages/mnk/mnk_shorked_1.png", zoom=zoomNUm)
image mnk shorked_2 = Transform("characterImages/mnk/mnk_shorked_2.png", zoom=zoomNUm)
image mnk shorked_3 = Transform("characterImages/mnk/mnk_shorked_3.png", zoom=zoomNUm)
image mnk shorked_4 = Transform("characterImages/mnk/mnk_shorked_4.png", zoom=zoomNUm)
image mnk sad_1 = Transform("characterImages/mnk/mnk_sad_1.png", zoom=zoomNUm)
image mnk sad_2 = Transform("characterImages/mnk/mnk_sad_2.png", zoom=zoomNUm)
image mnk sad_3 = Transform("characterImages/mnk/mnk_sad_3.png", zoom=zoomNUm)
image mnk sad_4 = Transform("characterImages/mnk/mnk_sad_4.png", zoom=zoomNUm)
image mnk joke_1 = Transform("characterImages/mnk/mnk_joke_1.png", zoom=zoomNUm)
image mnk angry_1 = Transform("characterImages/mnk/mnk_angry_1.png", zoom=zoomNUm)
image mnk angry_2 = Transform("characterImages/mnk/mnk_angry_2.png", zoom=zoomNUm)
image mnk angry_3 = Transform("characterImages/mnk/mnk_angry_3.png", zoom=zoomNUm)
image mnk angry_4 = Transform("characterImages/mnk/mnk_angry_4.png", zoom=zoomNUm)
image mnk angry_5 = Transform("characterImages/mnk/mnk_angry_5.png", zoom=zoomNUm)

#박여름
define pyr = Character('박여름', color="#8082d1")
image pyr standard = Transform("characterImages/pyr/pyr_standard.png", zoom=zoomNUm)
image pyr shy_1 = Transform("characterImages/pyr/pyr_shy_1.png", zoom=zoomNUm)
image pyr shy_2 = Transform("characterImages/pyr/pyr_shy_2.png", zoom=zoomNUm)
image pyr shy_3 = Transform("characterImages/pyr/pyr_shy_3.png", zoom=zoomNUm)
image pyr shy_4 = Transform("characterImages/pyr/pyr_shy_4.png", zoom=zoomNUm)
image pyr shorked_1 = Transform("characterImages/pyr/pyr_shorked_1.png", zoom=zoomNUm)
image pyr shorked_2 = Transform("characterImages/pyr/pyr_shorked_2.png", zoom=zoomNUm)
image pyr sad_1 = Transform("characterImages/pyr/pyr_sad_1.png", zoom=zoomNUm)
image pyr sad_2 = Transform("characterImages/pyr/pyr_sad_2.png", zoom=zoomNUm)
image pyr sad_3 = Transform("characterImages/pyr/pyr_sad_3.png", zoom=zoomNUm)
image pyr sad_4 = Transform("characterImages/pyr/pyr_sad_4.png", zoom=zoomNUm)
image pyr joke_1 = Transform("characterImages/pyr/pyr_joke_1.png", zoom=zoomNUm)
image pyr angry_1 = Transform("characterImages/pyr/pyr_angry_1.png", zoom=zoomNUm)
image pyr angry_2 = Transform("characterImages/pyr/pyr_angry_2.png", zoom=zoomNUm)
image pyr angry_3 = Transform("characterImages/pyr/pyr_angry_3.png", zoom=zoomNUm)
image pyr angry_4 = Transform("characterImages/pyr/pyr_angry_4.png", zoom=zoomNUm)

# silhouette
image pjy silhouette = Transform("characterImages/silhouettes/lhs.png", zoom=zoomNUm*2.2)
image lhs silhouette = Transform("characterImages/silhouettes/pjy.png", zoom=zoomNUm*2.2)