label chapter1_3:
    scene pub_background
   
    show pjy joke_1 at right_low:
        xoffset 150
    pjy "우리 조, 분위기 괜찮네요. 다들 오늘 고생했죠?"

    show lhs standard at left_low:
        xoffset -150
    lhs "네. 아까 환영회 엄청 시끄럽고 정신 없었는데, 선배 덕분에 안내 잘 받아서 편했어요."
    
    show pjy standard at right_low:
        xoffset 150
    pjy "그래요? 그 말 들으니까 보람 있네요~ 고마워요."
    main "선배는 도우미 자주 하세요?"
    
    pjy "작년에는 못했고요, 올해는 처음이에요."
    pjy "23학번이라 이번에 3학년 됐어요."
    main "아, 저희보다 2년 선배시네요."

    show pjy joke_1 at right_low:
        xoffset 150
    pjy "네~ 그러니까 저한테는 편하게 해도 괜찮아요."
    pjy "물론 존댓말은 지켜주고요, 후배님들~"
    
    show pjy standard at right_low:
        xoffset 150
    pjy "경민 씨는 대구에서 왔다고 했죠?"
    main "네. 기차 타고 올라왔어요. 서울은 아직 낯서네요."

    pjy "곧 익숙해질 거예요."
    pjy "저는 고향이 전주인데,"
    extend " 저도 처음엔 서울이 너무 복잡해서 정신이 없었거든요."

    show lhs shy_2 at left_low:
        xoffset -150
    lhs "선배, 근데 진짜 차분하세요."
    extend " 말도 조곤조곤 하시고요... 딱 이과 여신 느낌이랄까?"
    
    show pjy shy_1 at right_low:
        xoffset 150
    pjy "이과 여신은 무슨~ 그냥 평범한 학생이에요. 근데 칭찬은 감사히 받을게요."

    show lhs standard at left_low:
        xoffset -150
    main "선배는 말투도 예쁘셔서 그런 것 같아요. 좀 차분해지는 느낌이랄까."
    
    show pjy joke_1 at right_low, bounce:
        xoffset 150
    play sfx pjy_giggle
    pjy "어머, 오늘 후배들 말 너무 예쁘게 하네요. 내가 기분이 다 좋아지네~"
    pjy "자,"
    extend " 그럼 우리 조 첫 모임을 기념해서 건배할까요?"

    show lhs shorked_1 at left_low, bounce:
        xoffset -150
    jump chapter1_4