label chapter1_4:
    #scene 술집앞 밤거리 -> 실루엣만 보이게 처리해주세요.
    # effect- > 어지러운느낌
    scene night_walk_background with Dissolve(2)
    main "으음..."
    
    pause 1.0

    show pjy silhouette at left_low:
        xoffset -150
    show lhs silhouette at right_low:
        xoffset 150
    pjy "현서야, 경민이 많이 취한 것 같은데... 혹시 경민이 좀 챙겨줄 수 있어?"
    pause 0.5
    pjy "내가 지금 급하게 가봐야 할 곳이 있어서..."
    
    lhs "아, 네 선배. 걱정 마세요. 제가 택시 태워서 잘 보낼게요."
    
    hide pjy with dissolve
    pjy "정말 고마워. 두 사람 다 조심해서 들어가~"
    
    main "...나 진짜 취했나...?"
    lhs "완전은 아니고, 반쯤? 걱정 마. 지갑 어딨어? 집 주소 적혀있다고 했잖아."
    main "앞... 주머니... 안에..."
    lhs "오케이, 택시 부를게."
    main "현서야.... 오늘... 고맙다..."
    lhs "야, 그건 내일 맨정신일 때 다시 말해. 지금은 너 집 들어가는 것부터 신경 써."
    main "그래..."
    
    hide lhs with dissolve

    pause 1.0

    "'낯설었지만... 그래도 즐거웠다....'"
    
    "그렇게 나의 첫 대학 행사가 막을 내렸다."
    "며칠 후, 나는 동아리에 가입하기 위해 가두모집이 한창인 거리로 향했다."

    jump chapter2_1