label chapter3_4:
    scene pub_background_2_night 
    with dissolve
    show lhs standard at left_low:
        xoffset -150 
    with dissolve
    lhs "어, 벌써 1시네. 우리 기숙사 통금 걸리겠다."
    
    yuna "진짜? 빨리 가야겠다~ 오늘 즐거웠어!"
    
    lhs "응, 나도. 잘 들어가~!"
    yuna "안녕~"
    
    hide lhs 
    with dissolve
    main "...재밌었어. 안녕~"

    show jsk shy_1 at right_low:
        xoffset 150 
    with dissolve
    jsk "저기... 잠깐만...!"
    
    main "응...?"
    jsk "핸드폰 번호... 알려줄 수 있어?"

    menu:
        "1. 알려준다.":
            jump jsk_happy2
        "2. 번호 대신 카톡을 알려준다.":
            jump jsk_sad2

    label jsk_happy2:
        $likeJsk += 10
        main "....번호? 아.. 응, 알겠어."
        show jsk joke_1 at right_low:
            xoffset 150 
        with dissolve
        jsk "....고마워. 잘 들어가."
        main "응... 너도."
        hide jsk 
        with dissolve
        jump chapter3_5

    label jsk_sad2:
        $likeJsk -= 10
        main "어...? 갑자기?"
        show jsk shy_2 at right_low:
            xoffset 150 
        with dissolve
        jsk "응..."
        main "핸드폰 번호는 조금 그런데... 혹시 카톡 아이디 알려주는 건 안될까?"
        show jsk sad_1 at right_low:
            xoffset 150 
        with dissolve
        jsk "아... 응..."
        hide jsk 
        with dissolve
        
        "성경이와 아쉬운 인사를 나눈 뒤, 현서와 나는 나란히 기숙사로 향했다."
        "오늘의 만남이 어떤 인연으로 이어질지는, 아직 아무도 알 수 없었다."
        jump chapter3_5