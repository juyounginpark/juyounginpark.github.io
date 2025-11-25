label chapter6_2:
    if date_partner != "pjy":
        jump chapter6_3

    scene night_walk_background 
    with fade
    "축제 분위기가 한창 무르익은 오후."

    show pjy standard at center:
        xoffset 150 
    with dissolve
    pjy "오~ 경민이, 여기!"
    main "(우와… 진짜… 너무 눈에 띈다.)"
    main "선배, 안녕하세요!"
    pjy "어색하게 굴기는. 오늘은 그냥 즐기는 날인데~"
    main "하하, 네. 그렇죠…"

    show pjy joke_1 at center:
        xoffset 150 
    with dissolve
    pjy "오~ 경민이. 힘 좀 줬는데?"
    main "네, 넷?"
    show pjy standard at center:
        xoffset 150 
    with dissolve
    play sound pjy_giggle
    pjy "흐흐, 가자! 나 진짜 가보고 싶은 부스 있단 말야!"

    # 경민이 주연의 손에 이끌려 걷는다. 주연이 자연스럽게 손을 잡는다.
    main "(헉?! 손… 잡았어!?)"

    show pjy sad_1 at center:
        xoffset 150 
    with dissolve
    pjy "왜~? 손 잡는 거 싫어?"
    main "아, 아뇨! 괜찮아요!"
    show pjy joke_1 at center:
        xoffset 150 
    with dissolve
    play sound pjy_giggle
    pjy "후훗~ 귀여워."
    show pjy standard at center:
        xoffset 150 
    with dissolve
    pjy "자, 저기 풍선 다트 부스 가볼래? 나 저거 진짜 잘해!"
    main "(윽, 난 거의 안 해봤는데…) 그럴까요?"
    pjy "그냥 하면 재미없지~ 내기할래? 진 사람이 이긴 사람 소원 들어주기. 어때?"
    main "소원이요? 어떤 소원이든요?"
    pjy "응. 어떤 소원이든 다 가능!"
    main "(기필코 이기고 만다.) 가보죠."
    pjy "뭐야~ 무서워~"

    "(잠시 후, 나는 처참하게 패배했다.)"
    main "어렵네요… 하하."
    play sound pjy_giggle
    pjy "헤헤~ 오늘 운이 좋네. 소원은… 비밀!"
    main "아, 뭐예요…"
    pjy "몰라, 몰라~ 저기 간식 부스다! 빨리 와~"

    "핫도그와 소떡소떡을 손에 들었다."
    main "와… 평소에 먹던 거보다 더 맛있는데요."
    pjy "그건 나랑 먹고 있기 때문이지~"
    show pjy sad_1 at center:
        xoffset 150 
    with dissolve
    pjy "음? 입에 묻었어. 가만히 있어 봐…"
    "주연 선배가 손가락으로 내 입가의 소스를 닦아주었다."
    main "(…!)"
    main "아, 아. 감사합니다…!"
    
    show pjy standard at center:
        xoffset 150 
    with dissolve
    pjy "아, 저기저기! 타로 부스다. 나 은근히 저런 거 믿거든~ 가보자!"

    "타로 리더" "어서 오세요. 두 분, 커플이신가요?"
    main "아, 저희는 그런 건 아니고…"
    "타로 리더" "… 좋아요. 그럼 ‘두 분 사이 인연’을 봐드릴게요. 서로에 대한 생각을 마음속으로 떠올리면서 한 분씩 손을 얹어주세요."
    main "(주연 선배 손은… 따뜻하구나.)"
    "타로 리더" "‘연인‘… 이 카드는 단순한 로맨스가 아니라, 선택과 신뢰를 의미해요. 서로가 서로에게 특별한 영향을 주고 있는 관계죠."
    "타로 리더" "특히 이 조합은, 처음엔 장난처럼 시작되지만, 나중엔 진심이 되는 관계라고 나와요."
    show pjy joke_1 at center:
        xoffset 150 
    with dissolve
    pjy "경민아, 너 떨려?"
    main "아, 아뇨… 그런 건…"
    "타로 리더" "그리고 마지막 조언 카드, ‘별’… 이건 ‘희망’과 ‘진심’을 뜻하는 카드예요. 어떤 감정이든, 진심을 전하면 이루어질 가능성이 높다는 뜻이죠."
    
    show pjy standard at center:
        xoffset 150 
    with dissolve
    pjy "흐음… 그럼 말해볼까, 내 진심?"
    main "에, 네?!"
    show pjy joke_1 at center:
        xoffset 150 
    with dissolve
    play sound pjy_giggle
    pjy "뭐래. 기대했어? 흐흐…"

    scene night_walk_background 
    with fade
    show pjy standard at center:
        xoffset 150
    pjy "하암… 벌써 해가 졌네. 재밌게 놀았다."
    main "그러게요."
    pjy "경민아, 오늘 재밌었어?"
    main "네… 정말요. 이런 건 처음이라서…"
    pjy "실은… 나도야."
    show pjy shy_1 at center:
        xoffset 150 
    with dissolve
    pjy "내가 멜로 드라마 좋아하거든. 보면서… 이런 건 꼭 해보고 싶었던 거라…"
    pjy "그래서, 더 기억에 남을 것 같아."
    main "… 네. 저도 정말 그럴 것 같아요."

    show pjy sad_1 at center:
        xoffset 150 
    with dissolve
    pjy "아까 다트할 때 소원권, 기억나?"
    main "ㄴ…네?"
    show pjy shy_1 at center:
        xoffset 150 
    with dissolve
    pjy "내 소원은… 다음에도 같이 가고 싶은 곳, 같이 가주는 거."
    main "…네. 꼭 지킬게요. 소원이니까."

    hide pjy 
    with dissolve
    show mnk shorked_1 at far_right 
    with dissolve
    mnk "…"
    pause 0.5
    hide mnk 
    with dissolve

    jump chapter7_1