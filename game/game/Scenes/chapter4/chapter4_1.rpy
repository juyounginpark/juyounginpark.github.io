label chapter4_1:
    scene vending_machine_background with fade
    main "4시간 풀강 들었더니 죽을 것 같다…"
    main "뭐라도 마셔야지. 오늘도 역시 샤인머스캣으로."

    "(음료에 손을 뻗으려는 찰나, 옆에서 익숙한 목소리가 들렸다.)"
    "???" "혹시… 경민이?"

    "(고개를 돌린다. 긴 흑발에 잔잔한 눈웃음, 어딘가 낯익은 얼굴.)"
    main "어…? 잠깐만. 너… 혹시…"

    menu:
        "여름이... 맞지?":
            $ likeYeoreum += 20
            show pyr joke_1 at center with dissolve
            play sound pyr_giggle
            pyr "맞아. 박여름. 기억하는구나!"
        "미안한데… 혹시 이름이?":
            $ likeYeoreum += 10
            show pyr sad_1 at center with dissolve
            pyr "…"
            pyr "박여름. 기억 안 나?"
        "누구세요?":
            $ likeYeoreum += 0
            show pyr sad_2 at center with dissolve
            pyr "… 기억 안 나? 나 박여름."
    
    show pyr standard at center
    main "(확실히 기억났다. 나의 초등학교 시절 소꿉친구, 박여름.)"
    main "와, 아니… 진짜 반갑다."

    pyr "옛날에 우리 친했잖아. …그때랑 똑같네, 너."
    main "아하하... 진짜 오랜만이다."
    
    show pyr sad_1 at center with dissolve
    pyr "…"
    main "…"

    main "아! 그나저나... 너는 무슨 과야?"
    show pyr standard at center with dissolve
    pyr "응, 난 미술대. 너는?"
    main "나는 저기 컴퓨터공학과…"
    pyr "그렇구나. 뭐 마시려던 거 맞지? 마저 뽑아!"
    main "아, 응."
    pyr "역시나, 취향도 그대로네. 너나 나나."
    main "응? 뭐라고?"
    pyr "아, 아니야. 아무것도. 음, 혹시 다음 수업 있어?"
    main "아니… 없어."
    pyr "그럼 좀 같이 걸을래?"
    main "! ...그래!"

    hide pyr with dissolve
    jump chapter4_2