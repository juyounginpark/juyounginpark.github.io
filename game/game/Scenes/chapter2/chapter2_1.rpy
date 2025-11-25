label chapter2_1:
    scene street_background with fade
    "(웅성웅성)"

    main "우와… 이게 말로만 듣던 가두모집이구나."
    main "진짜 동아리가 많네… 어떤 동아리에 들어가야 하지?"

    show lhs shorked_1 at mid_low
    with dissolve
    with moveinright
    lhs "경민아!"
    
    main "헉, 현서야?! 여긴 어쩐 일이야?"

    
    play sound lhs_giggle
    lhs "나도 오늘 동아리 구경하러 왔지~"
    lhs "따로 생각해둔 곳이라도 있어?"

    main "아니, 아직… 그냥 둘러보는 중이야."

    hide lhs shorked_1
    "(현서와 복작복작한 동아리 라인을 걷는다.)"
    "(다들 자기 동아리 홍보하느라 정신이 없다.)"
    main "(어…? 저기 저 사람은…)"
    
    show pjy standard at center with dissolve
    pjy "‘부트캠프’로 코딩 알려주는 동아리 ‘해달’! 코딩 왕초보도 환영해요~"

    main "(어? 주연 선배다… 저기서 홍보 중이네.)"
    main "(동아리 이름이… 해달? 귀엽다.)"

    hide pjy with dissolve
    show lhs standard at left_low_offset with dissolve
    show pjy standard at right_low_offset
    
    lhs "저기 주연 선배 아냐?"
    main "응... 근데 괜히 인사하기 좀 그렇다. 기억 못하면 어색할지도…"
    lhs "뭐 어때~ 기억 못하면 웃고 넘어가면 되지. 자, 가자!"

    menu:
        "용기내서 인사한다":
            $likeJuyoun += 20
            main "ㅅ…선배! 안녕하세요."
            
            show pjy joke_1 at right_low_offset with dissolve
            pjy "어! 경민 씨! 그땐 잘 들어갔어요?"
            main "(내 이름을 기억하고 있어…!)"
            main "네…! 그땐 감사했어요! 여기서도 열일 하시네요…"
            
            show pjy shy_1 at right_low_offset with dissolve
            play sound pjy_giggle
            pjy "ㅎㅎ 신입생들에게 동아리 소개 중이에요. 혹시 동아리 찾고 있어요?"

        "인사하지 않는다":
            main "(그냥 조용히 지나가자.)"
            pjy "해달은 초보자도 부담없이 들어올 수 있어요!"
            pjy "C언어, 웹, 파이썬 부트캠프도 있고 해커톤이랑 MT도 자주 해요!"
            main "(MT도 있구나…)"

    lhs "괜찮아 보이는데? 우리 같이 들어갈래?"
    main "응! 저… 해달에 가입하고 싶어요!"
    
    show pjy joke_1 at right_low_offset with dissolve
    play sound pjy_giggle
    pjy "진짜요? 환영해요~"

    hide pjy with dissolve
    hide lhs with dissolve

    "주연 선배의 안내에 따라, 현서와 나는 동아리 방으로 향했다."
    "앞으로 자주 오게 될 이곳은 어떤 모습일까, 작은 기대감을 안고 문을 열었다."

    jump chapter2_2