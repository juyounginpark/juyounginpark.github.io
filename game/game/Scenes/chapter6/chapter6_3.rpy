screen write_poet(title, init_name):
    frame:
        xpadding 50
        ypadding 200
        xalign 0.5 yalign 0.5
        vbox:
            spacing 20
            text title xalign 0.5
            input default init_name xalign 0.5

label chapter6_3:
    if date_partner != "jsk":
        jump chapter6_4

    scene cafe_background 
    with fade
    show jsk standard at center:
        xoffset 150 
    with dissolve
    jsk "안녕. 여기야."
    main "어, 안녕! 진짜… 조용하다, 여기."
    jsk "응. 시끄러운 데는 별로 안 좋아해서…"
    main "이렇게 꾸며놓으니까 멋있다. 여긴 시집 코너인가?"
    jsk "응. 이 시, 들어봤어? 나태주 시인의 <풀꽃>."
    main "음, 들어본 것 같기도 하고… 어떤 시인데?"
    jsk "… 잠깐만."
    jsk "\"자세히 보아야 예쁘다\n오래 보아야 사랑스럽다\n너도 그렇다\""

    main "(잠시 넋이 나갈 정도로… 조용하고 예쁜 목소리다.)"
    
    show jsk sad_1 at center:
        xoffset 150 
    with dissolve
    jsk "음… 이 시는 풀꽃을 이야기하는 것 같지만, 사실은 마음의 거리에 대해 말하는 것 같아."
    jsk "쉽게 스쳐 지나가면 알 수 없는 사람. 천천히, 오래 곁에 있어야 비로소 진가가 드러나는…"
    
    show jsk standard at center:
        xoffset 150 
    with dissolve
    jsk "그런 사람이 되고 싶었어."
    jsk "조용하고, 무채색인 듯 보이지만, 오래 보면 밝고 따뜻한 사람."
    jsk "… 시가 그런 걸 알려주는 것 같아서 좋아해."
    main "정말… 그렇네."
    
    jsk "여긴, 단어를 뽑고, 그걸로 짧은 글을 쓰는 체험이야. 같이 할래?"
    main "나 시 같은 건 진짜 약한데… 뭐, 해볼까."
    
    "|기억|, |따뜻함|, |봄| 이라는 단어가 뽑혔다."
    $ poet = renpy.call_screen("write_poet", title="|기억| |따뜻함| |봄|", init_name=" ")
    main "나… 다 썼다."
    jsk "나도. 한번 읽어봐 줄래?"
    
    $ mid = len(poet) // 2
    $ poet_head = poet[:mid]
    $ poet_tail = poet[mid:]

    main "... \"[poet_head]"
    jsk "[poet_tail]\"..."
    jsk "잘 썼네. …네 말투가 느껴져."
    main "네 것도, 한번 읽어봐 줄 수 있어?"
    jsk "…"
    jsk "\"너를 바라보던 그날의 봄,\n햇살보다 더 밝게 웃던 기억.\""
    main "많이 써본 것 같다. 느낌 있네…"
    jsk "시를… 좋아해서. 글로 전하는 게 더 편할 때가 많거든."

    "우리는 나만의 책갈피 만들기 코너로 향했다."
    main "(서툰 가위질이, 왠지 약간 귀여운 것 같기도…)"
    jsk "끝났어."
    main "어? 진짜 예쁘다. 글씨도 정갈하고…"
    jsk "이거… 너 줄게."
    main "… 내가 받아도 되는 거야?"
    
    show jsk shy_1 at center:
        xoffset 150 
    with dissolve
    jsk "혹시… 너 것도 줄 수 있어?"
    jsk "오늘 너와 있었던 시간을, 기억하고 싶어서."
    main "나도. 오늘 되게… 좋았어."
    jsk "나야말로. 고마워."
    jsk "다음에도... 같이 함께 할 수 있을까?"
    main "물론이지."

    hide jsk 
    with dissolve
    show mnk shorked_2 at far_right 
    with dissolve
    mnk "…"
    pause 0.5
    hide mnk 
    with dissolve

    jump chapter7_1