label chapter9_4:
    scene cafe_background
    with fade
    show pyr angry_1 at center:
        xoffset 150
    with dissolve
    pyr "왔네."
    main "미안, 조금 늦었어."
    pyr "괜찮아. 어차피 공부 핑계로 여기 앉아있는 거니까."
    main "하하…"
    main "(왠지 화나 보인다…)"
    pyr "요즘 너 바쁘더라. 카톡도 바로 안 보고, 만나면 늘 급하게 가고."
    main "미안… 요즘 여러 가지 일로 바빴어."
    
    show pyr sad_1 at center:
        xoffset 150
    with dissolve
    pyr "알아. 시험 준비도 있고, 너 원래 계획적인 성격이잖아."
    pyr "근데… 약간 좀 섭섭하네."
    main "섭섭하다고?"
    pyr "응. 예전엔 사소한 얘기도 바로바로 나눴잖아. 오늘 뭐 먹었는지, 하늘색이 예쁘다, 이런 얘기까지."
    pyr "점점 뭐랄까… 나만 연락을 기다리는 기분."
    main "…"
    pyr "뭐, 그냥 친구라면 괜찮지만, 우리가 그냥 친구는 아니잖아."
    main "그런 건 아니야. 나도… 네 얘기 많이 궁금했어."
    pyr "안 믿겨…"
    main "진… 진짜야. 요새 일이 너무 많아서…"
    
    show pyr standard at center:
        xoffset 150
    with dissolve
    pyr "정말?"
    main "응."
    play sound pyr_giggle
    pyr "흐흐. 알았어."
    pyr "대신 시험 끝나고 많이 놀아주는 거다?"
    main "그래! 끝나자마자 연락할게."

    show pyr joke_1 at center:
        xoffset 150
    with dissolve
    pyr "그래~ 그럼 공부나 하자. 음… 뭔가 허전한데."
    play sound pyr_giggle
    pyr "케이크 먹지 않을래? 흐흐."
    main "하하... 좋아."
    main "(다행이다...)"


    hide pyr
    with dissolve
    jump chapter10_1