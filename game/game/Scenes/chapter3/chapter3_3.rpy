label chapter3_3:
    scene pub_background_2 with pushleft
    show lhs standard at left_low:
        xoffset -150
    with dissolve
    lhs "아직 안 왔네. 조금 늦는다더니."
    main "괜찮아. 뭐... 아직 시간도 있고."
    
    play sound lhs_giggle
    yuna "안녕하세요~ 많이 기다리셨어요?"
    
    lhs "아뇨, 저희도 방금 왔어요. 저는 이현서, 여긴 제 친구 서경민."

    yuna "반가워요! 전 유나라고 해요. 이쪽은 제 친구 성경이."
    $ jsk = Character('정성경', color="#fff42d")

    show jsk shy_1 at right_low:
        xoffset 150
    with dissolve
    jsk "...안녕하세요."

    lhs "두 분은 어떤 과세요?"

    yuna "우린 경영학과요. 25학번이고요."

    show lhs shorked_1 at left_low:
        xoffset -150
    with dissolve
    lhs "오, 우리도 25학번! 저희는 컴퓨터학부예요."

    yuna "컴공! 완전 어려운 거 배우네요~ 멋지다."

    jsk "...대단해요."

    main "경영은 어때요? 분위기나 수업 같은 거..."

    jsk "괜찮은 것 같아요."

    show lhs standard at left_low:
        xoffset -150
    lhs "저희는 진짜 과제가 미친 듯이 나와요. 근데 그래도 뭐... 재미는 있어요. 경영은 팀플이 많다고 들었는데 맞나요?"

    yuna "맞아요! 거의 팀플 천국이에요. 전 사람 만나는 거 좋아해서 나쁘진 않아요~"
    main "전 대문자 I라서 상상도 안 되네요… 대단하세요."
    yuna "아니에요, 여기 성경이도 엄청 낯가리는데 어떻게든 하더라고요."

    jsk "....네. 할 만해요..."

    main "'...지금 웃는 거 맞나...?'"

    jsk "...컴공 수업은 재밌어요?"

    main "어.. 그냥, 해볼 만은 해요. 아직은 적응 중이라서."

    lhs "저희 다 25학번 동갑인데, 말 편하게 할까요?"
    play sound lhs_giggle
    yuna "응! 너무 좋다. 서로 딱딱하게 하지 말고 편하게 반말하자."

    menu:
        "1. 말을 놓는다.":
            main "그럼 이제 말 편하게 할게."
            jump jsk_happy

        "2. 말을 놓지 않는다.":
            main "아... 아뇨. 전 아직 그렇게 편하지 않아서 존댓말 쓸게요."
            jump jsk_sad

    label jsk_happy:
        $likeJsk += 10
        show jsk joke_1 at right_low:
            xoffset 150
        with dissolve
        jsk "...응, 좋아."
        jump next

    label jsk_sad:
        $likeJsk -= 10
        show jsk sad_1 at right_low:
            xoffset 150
        with dissolve
        jsk "....아, 네."
        yuna "어... 그래..."
        jump next

    label next:
        main "'현서랑 유나는 대화 엄청 잘 나누네.'"
        main "저... 성경아. 넌 어쩌다가 경영학과에 가게 됐어?"
        jsk "아... 제일 무난하다고 생각이 들어서... 넌 어쩌다가 컴퓨터학부로 가게 된거야?"
        main "난 예전부터 컴퓨터 쪽에 관심이 많았어서... 이쪽으로 오게 됐어."
        jsk "아... 그렇구나."
        
    show lhs shorked_1 at left_low:
        xoffset -150
    with dissolve
    lhs "그럼 다들 어느 정도 친해진 것 같은데, 일단 술 한잔 할까?"
    yuna "좋다! 다들 잔 들고~ 짠~!"
        
    hide jsk with dissolve
    hide lhs with dissolve

    "어색했던 첫 만남도 잠시, 알코올의 힘 덕분인지 우리는 금세 친해질 수 있었다."
    "시간이 가는 줄도 모르고 웃고 떠들다 보니, 어느덧 막차 시간이 가까워지고 있었다."

    jump chapter3_4