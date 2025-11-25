label chapter7_5:
    scene goods_shop_background 
    with fade
    "(간판에 그려진 루루가 활짝 웃고 있다.)"

    main "어... 여긴..."
    show mnk standard at center:
        xoffset 150 
    with dissolve
    mnk "어때요? 눈이 반짝해지죠?"
    main "아니... 여길 왜..."
    mnk "경민 씨가 1학기 중간에 게시판에 올린 글, 봤거든요. “루루 10주년 피규어 못 산 게 평생 한이 될 듯”이라고."
    main "(그걸… 어떻게…)"
    mnk "그래서요. 오늘이 신상품 입고일이잖아요. 제가 예약해놨어요."
    main "예약... 을요?"
    mnk "네. ‘경민 씨 이름’으로."
    mnk "이쪽이에요. 2층 벽면에 한정판이 있어요."
    main "(저건… 해외 한정판이잖아.)"
    mnk "마음에 드세요?"
    main "(흔들리면 안 돼… 흔들리면 안 돼… 크윽…)"
    main "모... 몰라요."
    show mnk joke_1 at center:
        xoffset 150 
    with dissolve
    play sound mnk_giggle
    mnk "후후."
    mnk "다음 행선지는 메이드 카페랍니다~"
    main "으, 응? ;;;"
    
    hide mnk 
    with dissolve
    jump chapter7_6