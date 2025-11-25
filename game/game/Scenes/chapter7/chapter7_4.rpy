label chapter7_4:
    scene cafe_background 
    with fade
    main "어디있지…?"
    "창가 쪽에 앉아있는 모니카가 보였다."
    main "아… 저기 있다."

    show mnk sad_1 at center:
        xoffset 150 
    with dissolve
    mnk "... 안녕하세요."
    main "… 네."
    mnk "정말 죄송해요."
    main "네… 네?"
    mnk "어제는… 초면인데 저 혼자 너무 흥분해서, 많이 놀라셨을 것 같아요."
    main "(뭐야? 실은 괜찮은 사람인가…?)"
    main "저는, 너무 당황스러워서요. 대체 제 아이디는 어떻게 아시는 거고요…"
    
    show mnk standard at center:
        xoffset 150 
    with dissolve
    mnk "…"
    mnk "어제 했던 말들은 다 잊어주세요."
    mnk "제가 원래 이런 사람이 아닌데, 정말 못 볼 꼴만 보여드렸어요."
    mnk "아, 드세요. 먼저 시켜놓았어요."

    main "(샤인머스캣 에이드… 내가 제일 좋아하는 건데.)"
    main "감사합니다…"

    show mnk sad_2 at center:
        xoffset 150 
    with dissolve
    mnk "있잖아요, 저는 어릴 때부터 심장병을 앓아서, 제 어린 시절은 정말 까마득해요."
    main "(갑자기 이런 얘기를…)"
    mnk "제대로 된 친구도 없었고, 연애는 물론, 좋아하는 감정조차 가져본 적이 없어요."
    mnk "그런데, 신입생 환영회에서 낯가리는 경민 씨를 본 후부터… 조금씩, 조금씩, 빠져들게 되었어요."

    main "푸웁-"
    main "켁, 켁."
    
    show mnk angry_1 at center:
        xoffset 150 
    with dissolve
    mnk "이 얼마나 아름다운 서사예요?"
    mnk "세상과 거리를 두게 된 여자와, 세상과 거리를 두는 남자."
    show mnk angry_2 at center:
        xoffset 150 
    with dissolve
    mnk "그런데, 왜."
    mnk "왜 나만의 당신이, 다른 사람들과 웃고 있는 거죠?"
    show mnk angry_3 at center:
        xoffset 150 
    with dissolve
    mnk "박주연, 박여름, 정성경."
    show mnk angry_4 at center:
        xoffset 150 
    with dissolve
    mnk "왜? 왜? 왜? 왜? 왜? 왜? 왜? 왜? 왜?"
    show mnk angry_5 at center:
        xoffset 150 
    with dissolve
    mnk "왜???"

    main "지, 진정하세요!"

    show mnk sad_1 at center:
        xoffset 150 
    with dissolve
    mnk "…"
    mnk "죄송해요. 제가 또 그만…"

    main "(정말 아름다운 여자지만… 이런 사람이라면 곤란해.)"
    main "전, 솔직히 이러시는 거 조금 당황스러워요."
    mnk "… 그렇죠. 저도 알고 있어요. 경민 씨가 절 어떻게 보고 있을지."
    main "…"
    
    show mnk joke_1 at center:
        xoffset 150 
    with dissolve
    mnk "근데 있잖아요,"
    mnk "제가 경민 씨에 대해 알고 있는 건 어제 말한 것보다 훨씬 많아요."
    mnk "방 책장 윗칸, 2주 전에 받은 「쿠로냥☆ 마법소녀 7th anniversary 한정판」이라던가…"
    mnk "그리고 노트북 폴더 이름. 「사랑하는나의쿠로냥」 맞죠?"

    main "그, 그걸 어떻게!"

    mnk "저는 이런 거 전혀 부끄러운 취향이라고 생각 안 해요."
    mnk "오히려… 귀엽다고 생각해요. 정말로."
    mnk "그치만 이건 어떨까요. 주연 선배나, 여름 씨, 성경 씨 귀에 들어가기라도 한다면…"
    main "(이건… 큰일인데…)"

    show mnk standard at center:
        xoffset 150 
    with dissolve
    mnk "… 걱정 마요. 저는 아무 말 안 할 거예요."
    mnk "대신, 오늘 하루만 같이 있어줘요."
    mnk "데이트라 해도 좋고, 그냥 친구랑 노는 거라 해도 좋아요."
    mnk "경민 씨 마음대로 해도 좋으니까…"

    menu:
        "수락한다":
            main "(거절하면... 정말 끝장일지도.)"
            main "... 딱 하루만이에요."
            show mnk joke_1 at center:
                xoffset 150 
            with dissolve
            mnk "정말요!"
            mnk "그럼 빨리 일어나자고요!"
            $date_with_monika = True
            hide mnk 
            with dissolve
            jump chapter7_5
        "거절한다":
            main "(그래도 이건 아니지.)"
            main "죄송하지만, 이만 돌아가 주세요."
            show mnk sad_2 at center:
                xoffset 150 
            with dissolve
            mnk "..."
            mnk "전 포기 안 할 거예요."
            $date_with_monika = False
            hide mnk 
            with dissolve
            jump chapter8_1