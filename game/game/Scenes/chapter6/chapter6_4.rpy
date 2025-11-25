label chapter6_4:
    if date_partner != "pyr":
        jump chapter7_1 # Or wherever the next chapter starts

    scene goods_shop_background
    with fade
    show pyr standard at center:
        xoffset 150
    with dissolve
    pyr "여기야! 저기 포토존 예쁘지 않아?"
    main "응! 진짜 정성 들여 꾸며놨다."
    pyr "저기… 우리 같이 찍을래?"
    main "(헉…!) 어, 어… 좋아!"

    "여름이 먼저 셀카봉을 꺼내 든다."
    pyr "예전에 우리 같이 사진 찍은 거 기억나? 초등학교 운동회 때."
    main "아… 기억나. 그때처럼 이 사진도 오래 간직하고 싶어."

    "(찰칵)"
    main "잘 나왔나?"
    pyr "…응. 둘 다 웃고 있어서 좋아. 그때랑, 하나도 안 변한 것 같네."
    main "하하, 여전하지."
    show pyr shy_1 at center:
        xoffset 150
    with dissolve
    pyr "앞으로도 쭉 그랬으면…"
    main "응, 뭐라고?"
    show pyr standard at center:
        xoffset 150
    with dissolve
    play sound pyr_giggle
    pyr "헤헤, 아무것도 아니야."

    main "어? 저건 뭐야?"
    pyr "아, 저거! 즉석으로 인물 드로잉 해주는 이벤트야. 학생들이 직접 그려주거든."
    main "오~ 그럼 우리도 한번 해볼까?"
    pyr "잠깐만. 굳이 기다릴 필요는 없지."
    main "설마…"
    pyr "잠깐만 가만히 있어봐. 한 5분이면 돼."

    show pyr sad_1 at center:
        xoffset 150
    with dissolve
    "여름이가 스케치북에 무언가를 그리기 시작했다."
    main "(집중하는 모습, 처음 보는 것 같은데…)"
    main "나, 이렇게 가까이서 초상화 그려지는 거 처음이라 좀 긴장되는데?"
    pyr "가만히 있으라고 했지."
    pyr "…"
    
    show pyr standard at center:
        xoffset 150
    with dissolve
    pyr "… 완성."
    main "와… 이거 진짜, 잘 그렸다."
    main "(왠지, 거울의 나보다 더 잘생기게 나온 것 같은데…)"
    play sound pyr_giggle
    pyr "헤헤. 오늘 하루 네 표정이 담겨 있어. 그리고…"
    pyr "\"2025 축제, 같이 웃었던 날.\""
    pyr "이건 선물. 예전처럼… 잊지 말라고."
    main "… 고마워."

    pyr "아, 저거! 커플 낙서 보드래. 다들 이름 쓰고 가던데…"
    main "우리도 하나 남겨볼까?"
    show pyr shorked_1 at center:
        xoffset 150
    with dissolve
    pyr "에, 응??!"
    show pyr shy_2 at center:
        xoffset 150
    with dissolve
    pyr "아, 아니… 뭐어, 친구끼리도 쓰는 거니까."
    main "(나도 모르게 그만… 말해버렸네.)"
    pyr "커플, 커플이라니…"
    main "으, 응?"
    pyr "아니야. 사실… 이런 게 처음이라서…"

    "우리는 보드에 '경민, 여름'이라고 적고 작은 햇살 그림을 그렸다."
    main "햇살?"
    pyr "너는 항상 햇살 같아서. 항상 밝고, 오래오래… 비춰주는."
    main "(…가슴이 살짝 뛴다.)"
    main "여름아."
    pyr "응?"
    main "오늘 정말 고마워. 진짜 좋았어."
    show pyr shy_1 at center:
        xoffset 150
    with dissolve
    pyr "그래주면 다행이구…"

    hide pyr
    with dissolve
    show mnk shorked_3 at far_right
    with dissolve
    mnk "…"
    pause 0.5
    hide mnk
    with dissolve

    jump chapter7_1