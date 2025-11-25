label chapter10_1:
    scene sunset_walk_background with fade
    main "(드디어 중간고사가 끝났다.)"
    main "(참 많은 일들이 있었지.)"

    if route == 'juyoun':
        main "(주연 선배. 정말 든든하고, 재밌는 사람이었어.)"
        main "(내가 가장 붙잡고 싶은 사람은, 주연 선배야.)"
        jump chapter10_2
    elif route == 'sungkyung':
        main "(성경이. 너랑 있을 때면, 나 자신을 좀 더 들여다보게 돼.)"
        main "(내가 가장 붙잡고 싶은 사람은, 성경이야.)"
        jump chapter10_3
    elif route == 'yeoreum':
        main "(여름이. 오랜 친구지만, 그 이상의 감정을 느끼고 있다는 걸 알게 됐어.)"
        main "(내가 가장 붙잡고 싶은 사람은, 여름이야.)"
        jump chapter10_4
    elif route == 'monika':
        main "(그리고… 모니카.)"
        main "(마음은 널 피하려 했지만, 결국 너를 의식하게 됐어.)"
        main "(위험할지도 모르지만, 지금 내 마음이 향하는 곳은...)"
        jump chapter10_5
    
    # Fallback for old saves or different logic paths
    if likeJuyoun >= 80:
        jump chapter10_2
    elif likeJsk >= 80:
        jump chapter10_3
    elif likeYeoreum >= 80:
        jump chapter10_4
    elif likeMonika >= 60:
        jump chapter10_5
    elif likeProf >= 30:
        jump chapter10_6
    else:
        jump chapter10_7