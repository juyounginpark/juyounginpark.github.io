label chapter2_2:
    scene club_room_background with pushleft
    main "(여기가 동아리방…?) 생각보다 깔끔하네."
    main "안녕하세요!"

    show pjy standard at center:
        xoffset 150
    with dissolve
    pjy "어서와~ 둘 다 동아리방은 처음이지?"

    show lhs standard at left_low:
        xoffset -150
    with dissolve
    show pjy standard at right_low:
        xoffset 150
    with dissolve
    lhs "네! 되게 아늑하네요."

    pjy "그치? 편하게 앉아."
    lhs "선배님, 동방에선 보통 뭐 하세요? 다들 코딩만 하시나요?"

    show pjy shy_1 at right_low:
        xoffset 150
    with dissolve
    pjy "음… 코딩도 하고, 밥도 시켜 먹고, 가끔 수다만 떨다 가기도 해."
    main "(자주 오시나 보다…)"

    show pjy standard at right_low:
        xoffset 150
    with dissolve
    pjy "그나저나, 학교생활은 할 만해? 수업은 좀 어때?"
    main "그럭저럭이요. 어제 수업은 솔직히 조금 졸았어요…"
    play sound pjy_giggle
    pjy "ㅎㅎ 처음엔 다 그렇지. 학식은 먹어봤어?"
    main "네. 공식당 갔는데 줄이 엄청 길던데요."
    pjy "맞아~ 거긴 항상 그래. 다음엔 '러브로드' 쪽 건너서 있는 정보화 식당 가봐."

    lhs "‘러브로드’요?"
    main "‘러브로드’가 뭐예요?"

    show pjy joke_1 at right_low:
        xoffset 150
    with dissolve
    pjy "몰랐구나? 우리 학교 전설인데, 썸 타는 사이끼리 러브로드를 처음부터 끝까지 걸으면 사랑이 이루어진대."

    main "선배도 걸어본 적 있어요?"
    show pjy shy_2 at right_low:
        xoffset 150
    with dissolve
    pjy "음…"
    pause 0.5
    pjy "아직? 아직은 없지. 같이 걸을 사람이 없어서~"

    show pjy joke_1 at right_low:
        xoffset 150
    with dissolve
    pjy "왜, 같이 걷고 싶은 사람이라도 있어?"

    menu:
        "네":
            $likeJuyoun += 10
            main "네… 있어요."
            show pjy shorked_1 at right_low:
                xoffset 150
            with dissolve
            pjy "오…?"
        "아니요":
            main "아니요… 아직은요."

    show pjy joke_1 at right_low:
        xoffset 150
    with dissolve
    play sound pjy_giggle
    pjy "흐흐, 괜찮아. 아직 1학년이잖아. 러브로드는 천천히 걸어야 제맛이지~"
    pjy "아 맞다, 이번 MT 신청했어? 가서 신나게 놀자~"
    
    hide pjy with dissolve
    hide lhs with dissolve

    "그렇게 동아리 활동이 시작되고, 며칠 뒤 우리는 다 함께 MT를 떠나게 되었다."
    "고기 굽는 냄새와 즐거운 웃음소리가 가득한 곳에서, 새로운 이야기가 시작될 것만 같았다."

    jump chapter2_3