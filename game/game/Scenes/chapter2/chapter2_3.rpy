label chapter2_3:
    scene bbq_background 
    with fade

    show pjy joke_1 at center:
        xoffset 150 
    with dissolve
    pjy "고기 담당, 경민 씨~ 지금 고기를 익히는 중이에요, 아니면 태우는 중이에요?"
    main "음… 선배가 먹기 딱 좋은 타이밍을 기다리는 중입니다."

    pjy "와~ 멘트는 거의 셰프인데 손놀림은 완전 아마추어네?"

    show pjy standard at center:
        xoffset 150 
    with dissolve
    pjy "봐봐, 이쪽은 너무 익었고~ 여긴 아직 핏기가 있잖아. 이렇게 잘라서 가운데만 살짝 돌려줘야지."
    "(주연 선배가 내 손 위로 살짝 손을 얹고 고기를 뒤집는다.)"
    pause 1.0
    main "아, 네…! 진짜 이렇게까지 집중해서 고기 굽는 건 처음이에요."

    show pjy shy_2 at center:
        xoffset 150 
    with dissolve
    pjy "잘 구우면 인기 많아질걸~"
    main "그럼 오늘 제 운명은 이 불판 위에 달려 있겠네요."

    show pjy joke_1 at center:
        xoffset 150 
    with dissolve
    play sound pjy_giggle
    pjy "후후. 부담 좀 가지라고 한 말이야."

    "(조금 지나고, 고기에서 지글지글 소리가 나기 시작한다.)"
    main "오, 소리 좋은데요?"

    show pjy standard at center:
        xoffset 150 
    with dissolve
    pjy "그치? 난 이 소리 들으면 마음이 편해지더라."
    main "같이 굽고 있으니까 더 그런가 봐요."

    show pjy shy_1 at center:
        xoffset 150 
    with dissolve
    pjy "…너, 말 예쁘게 한다, 은근."

    show pjy standard at right_low:
        xoffset 150
    show lhs shorked_1 at left_low:
        xoffset -150 
    with dissolve
    lhs "야~ 고기 다 익었으면 나도 좀 껴줘!"

    main "도와줄래? 지금 뒤집는 타이밍 엄청 중요하단 말이야."

    show lhs standard at left_low:
        xoffset -150
    lhs "됐고~ 난 먹는 타이밍이 제일 중요해. 접시 내놔~"
    
    hide pjy 
    with dissolve
    hide lhs 
    with dissolve

    "시끌벅적했던 바비큐 파티가 끝나고, 나는 잠시 바람을 쐬러 밖으로 나왔다."
    "고요한 밤공기 속에서, 누군가와 조용히 걷고 싶다는 생각이 들었다."

    jump chapter2_4