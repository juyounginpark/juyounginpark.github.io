screen set_name(title, init_name):
    frame:
        xpadding 50
        ypadding 50
        xalign 0.5 yalign 0.5
        vbox:
            spacing 20
            text title xalign 0.5
            input default init_name xalign 0.5

label typeName:
    scene black with fade
    "2025년 3월."
    "나는 오늘, 한국대학교에 입학했다."
    "새로운 사람, 새로운 환경, 모든 것이 낯설다."
    "설레는 마음과 함께, 나의 새로운 이야기가 시작된다."
    
    $ player_name = renpy.input("내 이름은...", "서경민", length=15)
    $ player_name = player_name.strip()

    if player_name == "":
        $ player_name = "서경민"

    python:
        renpy.store.main = Character(player_name, color="#ffffff")

    main "좋아. 이제부터 내 이름은 [player_name]이다."
    
    jump chapter1_1