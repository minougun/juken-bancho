export const TOTAL_TURNS = 144;
export const PROFILE_SELECT_ANIMATION_MS = 1700;

export const statLabels = {
  academics: "学力",
  trust: "人望",
  face: "メンツ",
  looks: "ルックス",
  stamina: "体力",
  stress: "ストレス",
};

export const ENDING_STORAGE_KEY = "jukenBancho.unlockedEndings.v1";
export const EVENT_CG_STORAGE_KEY = "jukenBancho.unlockedEventCgs.v1";
export const STUDY_REVIEW_STORAGE_KEY = "jukenBancho.studyReview.v1";
export const GAMEPLAY_BGM_SRC = "./assets/audio/flesh-and-blood.mp3";

export const termBgm = {
  first: "./assets/audio/seasons/springtechno.ogg",
  summerBreak: "./assets/audio/seasons/summer-park.mp3",
  second: "./assets/audio/seasons/autumn-duasun.mp3",
  third: "./assets/audio/seasons/wintery-loop.mp3",
};

export const protagonistProfiles = [
  {
    id: "bancho",
    title: "受験番長",
    routeTitle: "目指せ合格番長",
    subtitle: "仁義とメンツを背負う硬派ルート",
    sprite: "./assets/images/protagonist-bancho-transparent.png",
    spriteClass: "character-sprite character-sprite--bancho",
    spriteAlt: "白い鉢巻きを巻き、学ラン姿で参考書とシャープペンを構える受験番長",
    initialStats: { academics: 14, trust: 60, face: 58, looks: 50, stamina: 72, stress: 20 },
    intro: [
      {
        speaker: "受験番長",
        sceneTag: "1年春・入学式",
        text: "俺の名は、番田長生。またの名を、受験番長。\n入学式の日から少しばかり顔が利く。仲間が困ってりゃ放っておけねえし、メンツをなくせば番長の看板も泣く。",
      },
      {
        speaker: "受験番長",
        sceneTag: "新しい教室",
        text: "だが高校三年間は長い。\n行事も、仲間との付き合いも、模試も赤本も、全部まとめて押し寄せてくる。",
      },
      {
        speaker: "受験番長",
        sceneTag: "三年計画",
        text: "毎週、俺は一つの予定を選ぶ。\n机に向かえば学力は積める。仲間と向き合えば人望やメンツは守れる。無理を重ねれば体力とルックスが削れ、焦りも腹にたまる。",
      },
      {
        speaker: "受験番長",
        sceneTag: "卒業まで三年",
        text: "卒業式の日、どんな顔で校門を出るか。\n全部まとめて背負ってこそ、番長ってもんだろ。",
      },
    ],
  },
  {
    id: "gyaru",
    title: "優等生ギャル",
    routeTitle: "目指せ優等生ギャル",
    subtitle: "マヂ情に厚い、友情も偏差値もアゲるルート",
    sprite: "./assets/images/protagonists/gyaru-protagonist-transparent.png",
    spriteClass: "character-sprite character-sprite--gyaru",
    spriteAlt: "参考書とシャープペンを持ち、カーディガン姿で笑う優等生ギャル",
    initialStats: { academics: 16, trust: 66, face: 55, looks: 72, stamina: 66, stress: 22 },
    intro: [
      {
        speaker: "優等生ギャル",
        sceneTag: "1年春・入学式",
        text: "ゥチの名前は、優谷生。またの名を、優等生ギャル。\n見た目でナメられがちだけど、友だち泣かすヤツは見過ごせない。マヂ情に厚いって、そーゆーこと。",
      },
      {
        speaker: "優等生ギャル",
        sceneTag: "新しい教室",
        text: "高校生活、行事も恋バナも友情もぜんぶ盛りたい。\nでも志望校だって諦めたくない。偏差値も気分も、ちゃんとアゲてく。",
      },
      {
        speaker: "優等生ギャル",
        sceneTag: "三年計画",
        text: "毎週、選べる予定は一つだけ。\n勉強すれば学力は上がる。友だちと向き合えば人望とメンツは守れる。でも無理しすぎたら、肌も心も荒れてルックスも落ちるってワケ。",
      },
      {
        speaker: "優等生ギャル",
        sceneTag: "卒業まで三年",
        text: "卒業式の日、最高に盛れた顔で笑いたい。\n目指せ優等生ギャル。友情も合格も、両方取るし。",
      },
    ],
  },
];

export const targetSchools = [
  {
    id: "johoku",
    name: "城北実学大学",
    deviation: 52,
    subtitle: "基礎を固めれば届く現実路線",
    totalTurns: 144,
    passAcademic: 74,
    passTrust: 42,
    passFace: 42,
    waitlistAcademic: 64,
    waitlistTrust: 68,
    waitlistFace: 68,
    weeklyStress: 0,
    lateStress: 1,
    staminaDrain: 0,
  },
  {
    id: "toto",
    name: "東都学院大学",
    deviation: 60,
    subtitle: "番長業との両立に綻びが出る中堅上位",
    totalTurns: 144,
    passAcademic: 82,
    passTrust: 48,
    passFace: 48,
    waitlistAcademic: 72,
    waitlistTrust: 70,
    waitlistFace: 70,
    weeklyStress: 1,
    lateStress: 1,
    staminaDrain: 0,
  },
  {
    id: "teio",
    name: "帝王義塾大学",
    deviation: 68,
    subtitle: "赤本も校内の視線も重くなる難関校",
    totalTurns: 144,
    passAcademic: 90,
    passTrust: 54,
    passFace: 54,
    waitlistAcademic: 80,
    waitlistTrust: 73,
    waitlistFace: 73,
    weeklyStress: 1,
    lateStress: 2,
    staminaDrain: 1,
  },
  {
    id: "tenrei",
    name: "国立天嶺大学",
    deviation: 74,
    subtitle: "半端な仁義も半端な勉強も通らない最難関",
    totalTurns: 144,
    passAcademic: 96,
    passTrust: 64,
    passFace: 64,
    waitlistAcademic: 88,
    waitlistTrust: 76,
    waitlistFace: 76,
    weeklyStress: 2,
    lateStress: 3,
    staminaDrain: 1,
  },
];

export const academicMilestones = {
  tenrei: [
    {
      turn: 48,
      requiredAcademics: 70,
      effects: { academics: 0, trust: 0, face: 0, looks: 0, stamina: 0, stress: 8 },
      message: "1年の締めで答案が重い。国立天嶺の背中は、序盤の遅れにも容赦しない。",
    },
    {
      turn: 96,
      requiredAcademics: 95,
      effects: { academics: 0, trust: 0, face: -3, looks: 0, stamina: 0, stress: 10 },
      message: "2年の終わり、進路面談の空気が固まる。学力の遅れがメンツにも響いた。",
    },
    {
      turn: 120,
      requiredAcademics: 98,
      effects: { academics: 0, trust: 0, face: 0, looks: 0, stamina: 0, stress: 12 },
      message: "3年秋、赤本の厚みが急に牙をむく。国立天嶺はここから一気に詰めてくる。",
    },
  ],
};

export const endingCatalog = [
  {
    id: "passed_bancho",
    title: "合格番長",
    hint: "学力も仁義も守り抜いた結末。",
    artwork: "./assets/images/endings/passed-bancho.png",
    artworkAlt: "校門前で合格通知を掲げ、仲間たちに囲まれる受験番長",
    bgm: "./assets/audio/endings/passed-bancho-victory.mp3",
    bgmTitle: "Victory",
  },
  {
    id: "lonely_pass",
    title: "孤独な合格",
    hint: "合格はしたが、校門前の仲間は少ない。",
    artwork: "./assets/images/endings/lonely-pass.png",
    artworkAlt: "夕暮れの校門前で合格通知を見つめる受験番長",
    bgm: "./assets/audio/endings/lonely-pass-sad-theme.mp3",
    bgmTitle: "Sad Theme",
  },
  {
    id: "waitlist_legend",
    title: "補欠の伝説",
    hint: "点数は少し届かないが、仲間は誰も責めない。",
    artwork: "./assets/images/endings/waitlist-legend.png",
    artworkAlt: "夕方の教室で通知を手にし、仲間に見守られる受験番長",
    bgm: "./assets/audio/endings/waitlist-forgotten-victory.ogg",
    bgmTitle: "Forgotten Victory",
  },
  {
    id: "bancho_legend",
    title: "番長伝説",
    hint: "受験には敗れても、校内に名は残る。",
    artwork: "./assets/images/endings/bancho-legend.png",
    artworkAlt: "夕焼けの屋上で仲間を背に立つ受験番長",
    bgm: "./assets/audio/endings/bancho-legend-determination.mp3",
    bgmTitle: "Determination",
  },
  {
    id: "failed",
    title: "不合格",
    hint: "予定から締め直すことになる結末。",
    artwork: "./assets/images/endings/failed.png",
    artworkAlt: "雨の教室で机に向かい、閉じた参考書を見つめる受験番長",
    bgm: "./assets/audio/endings/failed-game-over.ogg",
    bgmTitle: "Game Over",
  },
  {
    id: "passed_gyaru",
    title: "優等生ギャル",
    hint: "友情も合格も盛り切った結末。",
    artwork: "./assets/images/endings/gyaru/passed-gyaru.png",
    artworkAlt: "校門前で合格通知を掲げ、友人たちに祝福される優等生ギャル",
    bgm: "./assets/audio/endings/passed-bancho-victory.mp3",
    bgmTitle: "Victory",
  },
  {
    id: "lonely_gyaru",
    title: "孤独な合格ギャル",
    hint: "合格はしたが、友情の通知は少し既読スルー。",
    artwork: "./assets/images/endings/gyaru/lonely-gyaru.png",
    artworkAlt: "夕暮れの校門前で合格通知を見つめる優等生ギャル",
    bgm: "./assets/audio/endings/lonely-pass-sad-theme.mp3",
    bgmTitle: "Sad Theme",
  },
  {
    id: "waitlist_gyaru",
    title: "補欠のギャル伝説",
    hint: "点数は少し足りないが、友だちは誰も離れない。",
    artwork: "./assets/images/endings/gyaru/waitlist-gyaru.png",
    artworkAlt: "夕方の教室で通知を手にし、友人たちに励まされる優等生ギャル",
    bgm: "./assets/audio/endings/waitlist-forgotten-victory.ogg",
    bgmTitle: "Forgotten Victory",
  },
  {
    id: "legend_gyaru",
    title: "ギャル伝説",
    hint: "受験には敗れても、情の厚さは校内に残る。",
    artwork: "./assets/images/endings/gyaru/legend-gyaru.png",
    artworkAlt: "夕焼けの屋上で友人たちを背に立つ優等生ギャル",
    bgm: "./assets/audio/endings/bancho-legend-determination.mp3",
    bgmTitle: "Determination",
  },
  {
    id: "failed_gyaru",
    title: "不合格ギャル",
    hint: "予定から盛り直すことになる結末。",
    artwork: "./assets/images/endings/gyaru/failed-gyaru.png",
    artworkAlt: "雨の教室で机に向かい、参考書を見つめる優等生ギャル",
    bgm: "./assets/audio/endings/failed-game-over.ogg",
    bgmTitle: "Game Over",
  },
];

export const seasonalEvents = [
  {
    id: "spring_study_room",
    title: "桜の自習室",
    term: "1学期",
    triggerTurn: 10,
    speaker: "放課後の教室",
    sceneTag: "1学期イベント",
    text:
      "桜が散る窓際で、参考書のページだけがやけに白く光っていた。\n仲間の笑い声も、シャーペンの音も、今日だけは同じ方向を向いている。",
    hint: "1学期、桜の教室で机に向かった記憶。",
    artwork: "./assets/images/events/spring-study-room.png",
    artworkAlt: "桜が見える春の教室で、受験番長と優等生ギャルが仲間に囲まれながら勉強する",
    effects: { academics: 1, trust: 2, face: 0, looks: 0, stamina: 0, stress: -1 },
    routes: {
      bancho: {
        speaker: "舎弟たち",
        text:
          "桜が散る窓際で、舎弟が苦手科目のノートを差し出した。\n舎弟「番長、ここだけ何回やっても詰まるんすよ」\n受験番長「逃げる場所がわかってるなら、そこが今日の正面玄関だ」",
        artwork: "./assets/images/events/bancho/spring-study-room-bancho.png",
        artworkAlt: "桜が見える春の教室で、受験番長が舎弟たちと参考書を囲んで作戦を立てる",
        choices: [
          {
            id: "drill_weak_points",
            label: "弱点を洗い出す",
            text: "受験番長「全員、間違えた問題を机に出せ。弱点から逃げねえ」\n舎弟たちは顔を見合わせ、ノートの赤丸を一つずつ読み上げた。",
            effects: { academics: 2, trust: 1, face: 1, looks: 0, stamina: -1, stress: 1 },
          },
          {
            id: "keep_morale",
            label: "まず背中を押す",
            text: "受験番長「点数より先に目を上げろ。机に戻ってきた時点で負けちゃいねえ」\n教室の空気が少し軽くなり、シャーペンの音が揃った。",
            effects: { academics: 1, trust: 3, face: 1, looks: 0, stamina: 0, stress: -2 },
          },
        ],
      },
      gyaru: {
        speaker: "友だち",
        text:
          "桜色の窓際で、友だちがノートを抱えたまま固まっていた。\n友だち「ゥチ、春から置いてかれてるかも」\n優等生ギャル「置いてかないし。今日のページ、マヂ一緒に盛るよ」",
        artwork: "./assets/images/events/gyaru/spring-study-room-gyaru.png",
        artworkAlt: "桜が見える春の教室で、優等生ギャルが友だちとノートを広げて勉強する",
        choices: [
          {
            id: "share_notes",
            label: "神ノートをシェア",
            text: "優等生ギャル「ここ、色で分けると一気に見えるから」\n友だちのノートに付箋が増え、笑い声も少し戻った。",
            effects: { academics: 2, trust: 2, face: 0, looks: 1, stamina: -1, stress: 0 },
          },
          {
            id: "listen_first",
            label: "まず話を聞く",
            text: "優等生ギャル「点数の前に、何がしんどいか聞かせて」\n春の光の中で、友だちはようやく本音をこぼした。",
            effects: { academics: 1, trust: 3, face: 0, looks: 1, stamina: 0, stress: -2 },
          },
        ],
      },
    },
  },
  {
    id: "summer_study_festival",
    title: "夏祭りの単語帳",
    term: "夏休み",
    triggerTurn: 18,
    speaker: "夏祭りの夜",
    sceneTag: "夏休みイベント",
    text:
      "提灯の明かりの下、かき氷のカップと単語帳が並んだ。\n遊びきる顔も、受験生の顔も、どっちも捨てない夏にする。",
    hint: "夏休み、祭りの灯りの下で単語帳を開いた記憶。",
    artwork: "./assets/images/events/summer-study-festival.png",
    artworkAlt: "夏祭りの夜、受験番長と優等生ギャルが仲間たちと参考書やかき氷を持って歩く",
    effects: { academics: 1, trust: 2, face: 1, looks: 1, stamina: -2, stress: -1 },
    routes: {
      bancho: {
        speaker: "屋台の裏",
        text:
          "提灯の明かりの下、舎弟がりんご飴と単語帳を同じ手で持っている。\n舎弟「今日くらい勉強忘れてもよくないっすか」\n受験番長「忘れるんじゃねえ。祭りの熱で覚えるんだ」",
        artwork: "./assets/images/events/bancho/summer-study-festival-bancho.png",
        artworkAlt: "夏祭りの夜、受験番長が提灯の下で舎弟たちと単語帳を開く",
        choices: [
          {
            id: "festival_vocab",
            label: "屋台単語勝負",
            text: "受験番長「焼きそば一口ごとに一問だ。外したら青のり増しな」\n笑いながら始めた勝負は、意外なほど頭に残った。",
            effects: { academics: 2, trust: 1, face: 2, looks: 0, stamina: -2, stress: 1 },
          },
          {
            id: "cool_down",
            label: "川沿いで休ませる",
            text: "受験番長「今日は倒れるまでやる日じゃねえ。明日も机に戻るために座れ」\n祭りの音が遠のき、焦りも少し冷えた。",
            effects: { academics: 1, trust: 2, face: 1, looks: 1, stamina: 2, stress: -3 },
          },
        ],
      },
      gyaru: {
        speaker: "夏祭りの夜",
        text:
          "かき氷のカップの横で、友だちが単語帳をぱたぱた揺らしている。\n友だち「遊びたいけど、明日の小テストもヤバい」\n優等生ギャル「じゃ、遊びながら覚える。マヂ夏っぽくいこ」",
        artwork: "./assets/images/events/gyaru/summer-study-festival-gyaru.png",
        artworkAlt: "夏祭りの夜、優等生ギャルが友だちと提灯の下で単語帳を見せ合う",
        choices: [
          {
            id: "photo_memory",
            label: "映える暗記にする",
            text: "優等生ギャル「この単語、屋台の写真にくっつけて覚えよ」\nスマホの写真フォルダが、夏休みの暗記帳に変わった。",
            effects: { academics: 2, trust: 2, face: 0, looks: 2, stamina: -1, stress: 0 },
          },
          {
            id: "friend_priority",
            label: "友だちの顔を立てる",
            text: "優等生ギャル「今日は泣きそうな顔で我慢する日じゃないし」\n輪投げの景品より、友だちの笑顔の方が残った。",
            effects: { academics: 1, trust: 3, face: 1, looks: 1, stamina: 1, stress: -2 },
          },
        ],
      },
    },
  },
  {
    id: "autumn_culture_cleanup",
    title: "文化祭後の作戦会議",
    term: "2学期",
    triggerTurn: 72,
    speaker: "文化祭の後",
    sceneTag: "2学期イベント",
    text:
      "文化祭の飾りを片づけた後、机の上に残ったのは問題集だった。\n騒いだ分だけ、次は点数で取り返す。誰からともなく、そう決まった。",
    hint: "2学期、文化祭の余韻の中で進路を見直した記憶。",
    artwork: "./assets/images/events/autumn-festival-study.png",
    artworkAlt: "文化祭後の秋の教室で、受験番長と優等生ギャルが飾り付けの残る机で参考書を開く",
    effects: { academics: 2, trust: 1, face: 1, looks: 0, stamina: -2, stress: 1 },
    routes: {
      bancho: {
        speaker: "文化祭の後",
        text:
          "飾りを外した黒板の前で、舎弟が模試の結果を伏せている。\n舎弟「文化祭で浮かれてた分、点数が終わってるっす」\n受験番長「終わったのは祭りだ。点数はまだ動く」",
        artwork: "./assets/images/events/bancho/autumn-festival-study-bancho.png",
        artworkAlt: "文化祭後の秋の教室で、受験番長が舎弟たちと模試結果を見ながら作戦会議をする",
        choices: [
          {
            id: "hard_schedule",
            label: "秋の追い込み表を組む",
            text: "受験番長「ここから毎週、逃げ道を一つずつ潰す」\n机に書いた予定表は厳しいが、全員の目が前を向いた。",
            effects: { academics: 3, trust: 1, face: 1, looks: -1, stamina: -3, stress: 3 },
          },
          {
            id: "repair_team",
            label: "チームを立て直す",
            text: "受験番長「点数で責め合うな。まず誰がどこを助けるか決める」\n文化祭で残った団結が、勉強の机にも戻ってきた。",
            effects: { academics: 2, trust: 3, face: 2, looks: 0, stamina: -2, stress: 0 },
          },
        ],
      },
      gyaru: {
        speaker: "文化祭の後",
        text:
          "飾りの残った教室で、友だちが模試の結果を見て黙り込んだ。\n友だち「文化祭、楽しかったのに急に現実きた」\n優等生ギャル「現実きたなら、こっちも盛って返すだけ」",
        artwork: "./assets/images/events/gyaru/autumn-festival-study-gyaru.png",
        artworkAlt: "文化祭後の秋の教室で、優等生ギャルが友だちとカラフルな学習計画を立てる",
        choices: [
          {
            id: "color_plan",
            label: "盛れる計画にする",
            text: "優等生ギャル「この予定表、見た瞬間やる気出る色にしよ」\n赤点の赤ではなく、前向きな赤い付箋が増えた。",
            effects: { academics: 3, trust: 2, face: 0, looks: 1, stamina: -2, stress: 1 },
          },
          {
            id: "relationship_check",
            label: "友情の空気を整える",
            text: "優等生ギャル「点数で気まずくなるの、マヂもったいない」\n言いづらかった焦りを出し合うと、教室の空気がほどけた。",
            effects: { academics: 2, trust: 3, face: 1, looks: 1, stamina: -1, stress: -1 },
          },
        ],
      },
    },
  },
  {
    id: "winter_final_classroom",
    title: "雪夜の最終演習",
    term: "3学期",
    triggerTurn: 132,
    speaker: "雪夜の教室",
    sceneTag: "3学期イベント",
    text:
      "窓の外では雪が降り、教室の灯りだけが夜に浮いていた。\n最後の一問に向かう背中を、仲間たちは声を落として見守っている。",
    hint: "3学期、雪の夜に最後の演習へ向かった記憶。",
    artwork: "./assets/images/events/winter-final-study.png",
    artworkAlt: "雪の夜の教室で、受験番長と優等生ギャルが仲間に見守られながら受験勉強をする",
    effects: { academics: 3, trust: 1, face: 0, looks: -1, stamina: -4, stress: 3 },
    routes: {
      bancho: {
        speaker: "雪夜の教室",
        text:
          "窓の外では雪が降り、舎弟たちは声を落として見守っている。\n舎弟「番長、ここからまだ伸びますか」\n受験番長「伸ばすんじゃねえ。最後の一点を取りに行く」",
        artwork: "./assets/images/events/bancho/winter-final-study-bancho.png",
        artworkAlt: "雪の夜の教室で、受験番長が机のライトの下で最終演習に向かう",
        choices: [
          {
            id: "final_problem",
            label: "最後の難問へ行く",
            text: "受験番長「逃げた問題は本番で待ち伏せる。今ここで潰す」\n夜の教室に、鉛筆の音だけが残った。",
            effects: { academics: 4, trust: 1, face: 1, looks: -1, stamina: -5, stress: 4 },
          },
          {
            id: "protect_condition",
            label: "体調を守って締める",
            text: "受験番長「ここで倒れたら答案に名前も書けねえ。今日は勝てる形で帰る」\n仲間たちは静かにうなずき、鞄をまとめた。",
            effects: { academics: 2, trust: 2, face: 1, looks: 1, stamina: 2, stress: -3 },
          },
        ],
      },
      gyaru: {
        speaker: "雪夜の教室",
        text:
          "雪明かりの窓際で、友だちが温かい飲み物を机に置いた。\n友だち「もう十分やったよ」\n優等生ギャル「十分じゃなくて、最高にして終わりたい」",
        artwork: "./assets/images/events/gyaru/winter-final-study-gyaru.png",
        artworkAlt: "雪の夜の教室で、優等生ギャルが友だちに支えられながら最終演習に向かう",
        choices: [
          {
            id: "beauty_and_focus",
            label: "集中もルックスも守る",
            text: "優等生ギャル「明日の顔も答案も、どっちも崩さない」\n深呼吸してから解いた一問は、不思議と迷わなかった。",
            effects: { academics: 3, trust: 1, face: 0, looks: 2, stamina: -2, stress: -1 },
          },
          {
            id: "last_push",
            label: "泣きの一問まで粘る",
            text: "優等生ギャル「この一問だけ、マヂで置いていけない」\n眠気で目は重い。それでも最後の解法が線になった。",
            effects: { academics: 4, trust: 2, face: 1, looks: -1, stamina: -5, stress: 4 },
          },
        ],
      },
    },
  },
];

export const cards = [
  {
    id: "study_library",
    title: "自習室に乗り込む",
    subtitle: "静寂を制する者が受験を制す",
    flavor: "参考書を机に叩きつける。今日はシャーペンが相棒だ。",
    effects: { academics: 3, trust: -1, face: 1, looks: 0, stamina: -4, stress: 3 },
    minStamina: 14,
    unlockTurn: 0,
    oneShot: false,
    tag: "study",
    speaker: "受験番長",
    resultLead: "自習室の空気が一瞬で締まった。",
  },
  {
    id: "cram_school",
    title: "補習を受ける",
    subtitle: "先生に頭を下げるのも器量",
    flavor: "番長のメンツは少し削れるが、赤点回避の技術は身につく。",
    effects: { academics: 1, trust: 1, face: -1, looks: 0, stamina: -3, stress: 2 },
    minStamina: 10,
    unlockTurn: 0,
    oneShot: false,
    tag: "teacher",
    speaker: "生活指導の先生",
    resultLead: "職員室の時計だけがやけに大きく鳴った。",
  },
  {
    id: "ramen_meeting",
    title: "仲間とラーメン会議",
    subtitle: "替え玉より厚い信頼",
    flavor: "湯気の向こうで進路相談と近況報告を聞く。",
    effects: { academics: -1, trust: 2, face: 1, looks: 1, stamina: 2, stress: -2 },
    minStamina: 0,
    unlockTurn: 0,
    oneShot: false,
    tag: "social",
    speaker: "舎弟たち",
    resultLead: "どんぶりの底に、妙な団結が残った。",
  },
  {
    id: "rescue_fight",
    title: "仲裁に走る",
    subtitle: "仲間が絡まれたら、まず止めに入る",
    flavor: "参考書を閉じ、校門へ走る。拳より先に声を張るのが、今日の答案だ。",
    effects: { academics: 0, trust: 2, face: 2, looks: -1, stamina: -5, stress: 3 },
    minStamina: 24,
    unlockTurn: 0,
    oneShot: false,
    tag: "fight",
    speaker: "受験番長",
    resultLead: "夕焼けの校門前に、番長の一喝が響いた。",
  },
  {
    id: "sleep_early",
    title: "今日は寝る",
    subtitle: "番長も睡眠で回復する",
    flavor: "布団に沈む。夢の中で英単語とタイマンを張る。",
    effects: { academics: 0, trust: -1, face: 0, looks: 2, stamina: 9, stress: -6 },
    minStamina: 0,
    unlockTurn: 0,
    oneShot: false,
    tag: "rest",
    speaker: "受験番長",
    resultLead: "不良の夜更かしにも、限界はある。",
  },
  {
    id: "mock_exam",
    title: "模試に特攻",
    subtitle: "点数表から逃げない",
    flavor: "結果から逃げない。点数表を見て次の一手を決める。",
    effects: { academics: 3, trust: 0, face: 1, looks: -1, stamina: -6, stress: 5 },
    minStamina: 20,
    unlockTurn: 48,
    oneShot: false,
    tag: "exam",
    speaker: "模試監督",
    resultLead: "答案用紙は、喧嘩より正直だった。",
  },
  {
    id: "final_sprint",
    title: "赤本ラストスパート",
    subtitle: "本番直前の詰め込み仁義",
    flavor: "眠気も弱音も廊下に立たせる。最後は過去問だ。",
    effects: { academics: 4, trust: -2, face: 0, looks: -2, stamina: -9, stress: 7 },
    minStamina: 28,
    unlockTurn: 120,
    oneShot: false,
    tag: "exam",
    speaker: "受験番長",
    resultLead: "赤本のページが、夜明けまで鳴り続けた。",
  },
];

export const studyQuizQuestions = [
  {
    id: "japanese_argument",
    subject: "国語",
    area: "現代の国語",
    prompt: "評論文で筆者の主張を読むとき、最も重視する手がかりはどれか。",
    choices: ["接続語や段落末のまとめ", "文字数が一番多い段落", "漢字が難しい語句", "会話文の多さ"],
    answerIndex: 0,
    explanation: "逆接やまとめの接続語、段落末の要約は論理の流れを追う手がかりになる。",
  },
  {
    id: "japanese_classical",
    subject: "国語",
    area: "言語文化",
    prompt: "古文で助動詞「む」が文脈により表しにくい意味はどれか。",
    choices: ["推量", "過去", "意志", "勧誘"],
    answerIndex: 1,
    explanation: "「む」は推量・意志・勧誘・仮定などを表すが、過去は通常「き」「けり」などで表す。",
  },
  {
    id: "math_quadratic",
    subject: "数学",
    area: "数学I",
    prompt: "二次関数 y = (x - 2)^2 + 3 の頂点はどれか。",
    choices: ["(2, 3)", "(-2, 3)", "(2, -3)", "(0, 3)"],
    answerIndex: 0,
    explanation: "平方完成形 y = a(x - p)^2 + q の頂点は (p, q)。",
  },
  {
    id: "math_probability",
    subject: "数学",
    area: "数学A",
    prompt: "1個のさいころを1回投げる。偶数が出る確率はどれか。",
    choices: ["1/3", "2/3", "1/2", "1/6"],
    answerIndex: 2,
    explanation: "偶数は2,4,6の3通り。全6通りなので 3/6 = 1/2。",
  },
  {
    id: "english_tense",
    subject: "英語",
    area: "英語コミュニケーションI",
    prompt: "次の文の空所に入る最も自然な語はどれか。I have ____ my homework.",
    choices: ["finished", "finish", "finishing", "to finish"],
    answerIndex: 0,
    explanation: "現在完了 have + 過去分詞なので finished が入る。",
  },
  {
    id: "english_reading",
    subject: "英語",
    area: "論理・表現I",
    prompt: "because が導く節の基本的な役割はどれか。",
    choices: ["時を示す", "逆接を示す", "理由を示す", "比較を示す"],
    answerIndex: 2,
    explanation: "because は理由を説明する接続詞として使う。",
  },
  {
    id: "science_photosynthesis",
    subject: "理科",
    area: "生物基礎",
    prompt: "光合成で主に必要なものの組み合わせとして適切なのはどれか。",
    choices: ["光・二酸化炭素・水", "酸素・窒素・食塩", "光・酸素・でんぷん", "水素・酸素・鉄"],
    answerIndex: 0,
    explanation: "植物は光エネルギーを使い、二酸化炭素と水から有機物をつくる。",
  },
  {
    id: "science_force",
    subject: "理科",
    area: "物理基礎",
    prompt: "物体にはたらく合力が0のとき、物体の運動について正しい説明はどれか。",
    choices: ["必ず速くなる", "静止または等速直線運動を続ける", "必ず止まる", "必ず向きが変わる"],
    answerIndex: 1,
    explanation: "合力が0なら加速度は0で、運動状態は変化しない。",
  },
  {
    id: "social_constitution",
    subject: "社会",
    area: "公共",
    prompt: "日本国憲法の三大原理に含まれないものはどれか。",
    choices: ["市場経済の自由放任", "国民主権", "基本的人権の尊重", "平和主義"],
    answerIndex: 0,
    explanation: "三大原理は国民主権、基本的人権の尊重、平和主義。",
  },
  {
    id: "social_geography",
    subject: "社会",
    area: "地理総合",
    prompt: "地形図で等高線の間隔が狭い場所は、一般にどのような地形か。",
    choices: ["平地が広い", "標高が必ず低い", "海岸線に近い", "傾斜が急"],
    answerIndex: 3,
    explanation: "等高線の間隔が狭いほど、短い距離で高度が大きく変わる。",
  },
];

export const targetExamQuestions = {
  johoku: [
    {
      id: "johoku_math_linear",
      subject: "数学",
      area: "基礎実戦型・数学I",
      prompt: "一次関数 y = 2x + 1 について、x が 3 のときの y の値はどれか。",
      choices: ["5", "6", "7", "8"],
      answerIndex: 2,
      explanation: "x = 3 を代入すると y = 2×3 + 1 = 7。",
    },
    {
      id: "johoku_english_basic",
      subject: "英語",
      area: "基礎実戦型・英語コミュニケーションI",
      prompt: "次の日本語に最も近い英文はどれか。「私は昨日、その本を読んだ。」",
      choices: ["I read the book yesterday.", "I reads the book yesterday.", "I will read the book yesterday.", "I am read the book yesterday."],
      answerIndex: 0,
      explanation: "過去を表す yesterday があるので、動詞は過去形 read を使う。",
    },
    {
      id: "johoku_japanese_summary",
      subject: "国語",
      area: "基礎実戦型・現代文",
      prompt: "説明文の要約として最も適切なものを選ぶとき、まず確認すべき点はどれか。",
      choices: ["本文全体で繰り返される中心内容", "最初に出た固有名詞だけ", "文字数が最も少ない文", "難しい漢字の数"],
      answerIndex: 0,
      explanation: "要約では、本文全体を貫く中心内容を押さえることが重要。",
    },
    {
      id: "johoku_science_density",
      subject: "理科",
      area: "基礎実戦型・化学基礎",
      prompt: "同じ体積で質量が大きい物質ほど、一般に大きくなる値はどれか。",
      choices: ["密度", "温度", "湿度", "電圧"],
      answerIndex: 0,
      explanation: "密度は質量を体積で割った値なので、同じ体積なら質量が大きいほど密度も大きい。",
    },
    {
      id: "johoku_social_diet",
      subject: "社会",
      area: "基礎実戦型・公共",
      prompt: "日本の国会について、最も適切な説明はどれか。",
      choices: ["国の唯一の立法機関である", "裁判だけを行う機関である", "地方公共団体だけを管理する", "内閣総理大臣が廃止できる"],
      answerIndex: 0,
      explanation: "日本国憲法は、国会を国権の最高機関であり唯一の立法機関と定めている。",
    },
  ],
  toto: [
    {
      id: "toto_english_inference",
      subject: "英語",
      area: "中堅上位私大型・読解",
      prompt: "英文読解で however の直後に置かれる内容として最も自然なのはどれか。",
      choices: ["前文と対立する内容", "前文の具体例だけ", "前文と同じ内容の反復", "時系列の開始だけ"],
      answerIndex: 0,
      explanation: "however は逆接の接続副詞で、前文と対立・修正する内容を導きやすい。",
    },
    {
      id: "toto_social_modern",
      subject: "社会",
      area: "中堅上位私大型・日本史/公共",
      prompt: "明治期の近代化政策として最も適切なものはどれか。",
      choices: ["殖産興業", "荘園公領制", "参勤交代", "摂関政治"],
      answerIndex: 0,
      explanation: "明治政府は殖産興業により近代産業の育成を進めた。",
    },
    {
      id: "toto_japanese_contrast",
      subject: "国語",
      area: "中堅上位私大型・評論",
      prompt: "評論文で「一方」とある直後の内容として最も想定しやすいものはどれか。",
      choices: ["前の内容と対比される内容", "前文の完全な繰り返し", "本文と無関係な余談", "結論の撤回だけ"],
      answerIndex: 0,
      explanation: "「一方」は対比の合図になりやすく、前の内容との違いを読む手がかりになる。",
    },
    {
      id: "toto_math_probability",
      subject: "数学",
      area: "中堅上位私大型・数学A",
      prompt: "赤玉3個、白玉2個の袋から同時に2個取り出す。2個とも赤玉である確率はどれか。",
      choices: ["3/10", "1/2", "2/5", "3/5"],
      answerIndex: 0,
      explanation: "全体は5個から2個で10通り、赤2個は3個から2個で3通り。よって3/10。",
    },
    {
      id: "toto_science_enzyme",
      subject: "理科",
      area: "中堅上位私大型・生物基礎",
      prompt: "酵素の性質として最も適切なものはどれか。",
      choices: ["特定の反応を進める触媒として働く", "どんな温度でも必ず同じ速さで働く", "反応後に必ず消費される", "光がないと存在できない"],
      answerIndex: 0,
      explanation: "酵素は生体内の化学反応を進める触媒で、基質特異性を持つ。",
    },
  ],
  teio: [
    {
      id: "teio_japanese_abstract",
      subject: "国語",
      area: "難関私大型・評論",
      prompt: "抽象度の高い評論で、筆者が具体例を挙げる主な目的として最も妥当なのはどれか。",
      choices: ["主張を読者に理解しやすくするため", "結論を別の主張へ変えるため", "本文の論理を断ち切るため", "反対意見だけを正しいと示すため"],
      answerIndex: 0,
      explanation: "具体例は、抽象的な主張や概念を読者が把握しやすくする役割を持つ。",
    },
    {
      id: "teio_english_paraphrase",
      subject: "英語",
      area: "難関私大型・語彙/読解",
      prompt: "文中の “not necessarily” に最も近い意味はどれか。",
      choices: ["必ずしもそうではない", "絶対にそうである", "ほとんど常にそうである", "すでに必要ない"],
      answerIndex: 0,
      explanation: "not necessarily は「必ずしも〜ではない」という部分否定を表す。",
    },
    {
      id: "teio_math_sequence",
      subject: "数学",
      area: "難関私大型・数学B",
      prompt: "等差数列 3, 7, 11, ... の第10項はどれか。",
      choices: ["39", "40", "43", "47"],
      answerIndex: 0,
      explanation: "初項3、公差4なので、第10項は 3 + 9×4 = 39。",
    },
    {
      id: "teio_science_momentum",
      subject: "理科",
      area: "難関私大型・物理基礎",
      prompt: "外力がはたらかない二物体の衝突で保存される量として最も適切なものはどれか。",
      choices: ["運動量", "温度", "体積", "電気抵抗"],
      answerIndex: 0,
      explanation: "外力が無視できる系では、衝突の前後で運動量が保存される。",
    },
    {
      id: "teio_social_constitution",
      subject: "社会",
      area: "難関私大型・公共/政治経済",
      prompt: "違憲立法審査権について、最も適切な説明はどれか。",
      choices: ["法令が憲法に反しないかを裁判所が審査する権限", "内閣が法律を自由に停止する権限", "国会が裁判官を任命する権限", "地方自治体が条約を結ぶ権限"],
      answerIndex: 0,
      explanation: "違憲立法審査権は、法令などが憲法に適合するかを裁判所が判断する権限。",
    },
  ],
  tenrei: [
    {
      id: "tenrei_math_function",
      subject: "数学",
      area: "最難関国立型・数学I/A",
      prompt: "二次関数 f(x)=x^2-4x+1 の最小値はどれか。",
      choices: ["-3", "-2", "1", "3"],
      answerIndex: 0,
      explanation: "f(x)=(x-2)^2-3 なので、x=2 のとき最小値は -3。",
    },
    {
      id: "tenrei_english_argument",
      subject: "英語",
      area: "最難関国立型・要旨把握",
      prompt: "長文の要旨を選ぶとき、最も避けるべき選択肢はどれか。",
      choices: ["本文の一部だけを過度に一般化したもの", "段落全体の論旨をまとめたもの", "結論と理由の関係を含むもの", "筆者の主張を言い換えたもの"],
      answerIndex: 0,
      explanation: "要旨問題では、本文の一部だけを広げすぎた選択肢は全体の主張から外れやすい。",
    },
    {
      id: "tenrei_japanese_logic",
      subject: "国語",
      area: "最難関国立型・現代文",
      prompt: "評論文で筆者の主張と対立する見解が置かれる主な効果として最も妥当なのはどれか。",
      choices: ["主張の輪郭を明確にするため", "本文の結論を消すため", "読者に本文を読ませないため", "語句の意味を辞書順に並べるため"],
      answerIndex: 0,
      explanation: "対立見解を示すことで、筆者自身の立場や論点がより明確になる。",
    },
    {
      id: "tenrei_science_chemical_equilibrium",
      subject: "理科",
      area: "最難関国立型・化学基礎/化学",
      prompt: "可逆反応が平衡状態にあるとき、正反応と逆反応について最も適切な説明はどれか。",
      choices: ["反応速度が等しい", "どちらの反応も完全に止まる", "正反応だけが進む", "生成物が必ず0になる"],
      answerIndex: 0,
      explanation: "化学平衡では、正反応と逆反応の速度が等しくなり、見かけ上濃度が一定になる。",
    },
    {
      id: "tenrei_social_separation",
      subject: "社会",
      area: "最難関国立型・公共/政治経済",
      prompt: "権力分立の考え方として最も適切なものはどれか。",
      choices: ["権力を複数の機関に分け、相互に抑制させる", "すべての権限を一人に集中させる", "司法を行政の下部組織にする", "法律の制定を禁止する"],
      answerIndex: 0,
      explanation: "権力分立は、権力の集中を防ぎ、立法・行政・司法などが相互に抑制する仕組み。",
    },
  ],
};

const STUDY_QUIZ_VARIANTS_PER_BASE = 1000;
const baseStudyQuizQuestionCount = studyQuizQuestions.length;
const baseTargetExamQuestionCount = Object.values(targetExamQuestions).reduce((total, questions) => total + questions.length, 0);

function choice(seed, items) {
  return items[Math.abs(seed) % items.length];
}

const variantScenes = [
  "朝の教室",
  "放課後の自習室",
  "模試の休み時間",
  "図書室の窓際",
  "進路面談の前",
  "文化祭準備の合間",
  "冬休みの講習",
  "雨の日の廊下",
  "屋上での復習",
  "通学電車の中",
  "体育祭翌日",
  "赤本を開いた夜",
  "定期テスト前",
  "購買前の行列",
  "三者面談の帰り",
  "早朝の教室",
  "夏期講習の午後",
  "模試返却の日",
  "卒業式前の廊下",
  "春休み前のHR",
];

const variantTopics = [
  "進路",
  "友情",
  "努力",
  "睡眠",
  "校則",
  "部活",
  "文化祭",
  "模試",
  "赤本",
  "スマホ",
  "自習室",
  "補習",
  "面談",
  "緊張",
  "集中",
  "復習",
  "時間管理",
  "答案",
  "目標",
  "卒業",
];

const variantAngles = ["要点を整理しながら", "根拠を探しながら", "答案方針を立てながら", "友だちに説明するつもりで", "見直しの観点から"];

function variantContext(seed) {
  const topicSeed = Math.floor(seed / variantScenes.length);
  const angleSeed = Math.floor(seed / (variantScenes.length * variantTopics.length));
  return `${choice(seed, variantScenes)}で${choice(topicSeed, variantTopics)}について${choice(angleSeed, variantAngles)}考える場面`;
}

function ensureDistinctChoices(question) {
  const used = new Set();
  const choices = question.choices.map((choiceText, index) => {
    if (!used.has(choiceText)) {
      used.add(choiceText);
      return choiceText;
    }
    let candidate = index === question.answerIndex ? `${choiceText}（正答）` : `${choiceText}ではない`;
    let suffix = 2;
    while (used.has(candidate)) {
      candidate = index === question.answerIndex ? `${choiceText}（正答${suffix}）` : `${choiceText}ではない${suffix}`;
      suffix += 1;
    }
    used.add(candidate);
    return candidate;
  });
  return { ...question, choices };
}

function shuffleQuestionChoices(question, seed) {
  const normalizedQuestion = ensureDistinctChoices(question);
  const order = normalizedQuestion.choices
    .map((_, index) => index)
    .sort((left, right) => variantNumber(seed, left) - variantNumber(seed, right));
  return {
    ...normalizedQuestion,
    choices: order.map((index) => normalizedQuestion.choices[index]),
    answerIndex: order.indexOf(normalizedQuestion.answerIndex),
  };
}

function variantNumber(seed, offset) {
  let value = (seed + 1) * 1103515245 + (offset + 3) * 12345;
  value ^= value >>> 16;
  return value >>> 0;
}

function withVariantId(base, variantIndex, patch) {
  const question = {
    ...base,
    ...patch,
    id: variantIndex === 0 ? base.id : `${base.id}__v${String(variantIndex).padStart(4, "0")}`,
  };
  return shuffleQuestionChoices(question, variantIndex);
}

function makeMathVariant(base, variantIndex) {
  if (base.id.includes("linear")) {
    const a = (variantIndex % 7) + 1;
    const b = ((variantIndex * 3) % 17) - 8;
    const x = ((variantIndex * 5) % 13) - 6;
    const y = a * x + b;
    return withVariantId(base, variantIndex, {
      prompt: `${variantContext(variantIndex)}。一次関数 y = ${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} について、x が ${x} のときの y の値はどれか。`,
      choices: [String(y), String(y + a + 1), String(y - a - 1), String(y + 2 * a + 3)],
      answerIndex: 0,
      explanation: `x = ${x} を代入すると y = ${a}×${x} ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} = ${y}。`,
    });
  }
  if (base.id.includes("quadratic") || base.id.includes("function")) {
    const h = (variantIndex % 11) - 5;
    const k = ((Math.floor(variantIndex / 11) * 7) % 19) - 9;
    const a = (Math.floor(variantIndex / (11 * 19)) % 5) + 1;
    return withVariantId(base, variantIndex, {
      prompt: `${variantContext(variantIndex)}。二次関数 y = ${a}(x ${h < 0 ? `+ ${Math.abs(h)}` : `- ${h}`})^2 ${k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`} の最小値はどれか。`,
      choices: [String(k), String(k + a + 1), String(k - a - 1), String(k + 2 * a + 3)],
      answerIndex: 0,
      explanation: `平方の項は0以上なので、x = ${h} のとき最小値は ${k}。`,
    });
  }
  if (base.id.includes("probability")) {
    const red = (variantIndex % 50) + 3;
    const white = (Math.floor(variantIndex / 50) % 40) + 2;
    const total = red + white;
    const numerator = (red * (red - 1)) / 2;
    const denominator = (total * (total - 1)) / 2;
    return withVariantId(base, variantIndex, {
      prompt: `${variantContext(variantIndex)}。赤玉${red}個、白玉${white}個の袋から同時に2個取り出す。2個とも赤玉である確率はどれか。`,
      choices: [`${numerator}/${denominator}`, `${red + 1}/${total}`, `${white}/${total + 1}`, `${red - 1}/${denominator}`],
      answerIndex: 0,
      explanation: `全体は${total}個から2個で${denominator}通り、赤2個は${red}個から2個で${numerator}通り。`,
    });
  }
  const first = (variantIndex % 17) - 8;
  const diff = (Math.floor(variantIndex / 17) % 10) + 2;
  const term = (Math.floor(variantIndex / (17 * 10)) % 16) + 5;
  const answer = first + (term - 1) * diff;
  return withVariantId(base, variantIndex, {
    prompt: `${variantContext(variantIndex)}。等差数列 ${first}, ${first + diff}, ${first + diff * 2}, ... の第${term}項はどれか。`,
    choices: [String(answer), String(answer + diff), String(answer - diff), String(answer + diff + term + 1)],
    answerIndex: 0,
    explanation: `初項${first}、公差${diff}なので、第${term}項は ${first} + ${term - 1}×${diff} = ${answer}。`,
  });
}

function makeEnglishVariant(base, variantIndex) {
  const verbs = [
    ["finish", "finished", "宿題を終えた"],
    ["visit", "visited", "図書館を訪れた"],
    ["watch", "watched", "その講義を見た"],
    ["study", "studied", "英語を勉強した"],
    ["practice", "practiced", "発音を練習した"],
  ];
  if (base.id.includes("tense") || base.id.includes("basic")) {
    const [plain, past, meaning] = choice(variantIndex, verbs);
    return withVariantId(base, variantIndex, {
      prompt: `${variantContext(variantIndex)}。次の日本語に最も近い英文はどれか。「私は昨日、${meaning}。」`,
      choices: [`I ${past} yesterday.`, `I ${plain} yesterday.`, `I will ${plain} yesterday.`, `I am ${plain} yesterday.`],
      answerIndex: 0,
      explanation: "yesterday があるので、過去を表す動詞の形を使う。",
    });
  }
  const signals = [
    ["however", "前文と対立する内容", "逆接"],
    ["therefore", "前文から導かれる結論", "結論"],
    ["for example", "前文を支える具体例", "例示"],
    ["in contrast", "比較して違いを示す内容", "対比"],
    ["because", "理由を説明する内容", "理由"],
  ];
  if (base.id.includes("reading") || base.id.includes("inference") || base.id.includes("argument")) {
    const [word, answer, role] = choice(variantIndex, signals);
    return withVariantId(base, variantIndex, {
      prompt: `${variantContext(variantIndex)}。英文読解で ${word} の直後に置かれる内容として最も自然なのはどれか。`,
      choices: [answer, "前文と無関係な話題", "本文の主張を消す内容", "時制だけを説明する語句"],
      answerIndex: 0,
      explanation: `${word} は${role}の合図になりやすい。`,
    });
  }
  const phrases = [
    ["not necessarily", "必ずしもそうではない"],
    ["in other words", "言い換えると"],
    ["on the other hand", "一方で"],
    ["as a result", "結果として"],
    ["in addition", "さらに"],
  ];
  const [phrase, meaning] = choice(variantIndex, phrases);
  return withVariantId(base, variantIndex, {
    prompt: `${variantContext(variantIndex)}。文中の “${phrase}” に最も近い意味はどれか。`,
    choices: [meaning, "絶対にそうである", "本文と無関係である", "すでに必要ない"],
    answerIndex: 0,
    explanation: `${phrase} は文脈上「${meaning}」に近い働きをする。`,
  });
}

function makeJapaneseVariant(base, variantIndex) {
  const cues = [
    ["しかし", "前の内容と逆の方向へ論を進める"],
    ["つまり", "前の内容を言い換えてまとめる"],
    ["たとえば", "主張を具体例で支える"],
    ["一方", "前の内容と対比する"],
    ["したがって", "前の内容から結論を導く"],
  ];
  if (base.id.includes("classical")) {
    const auxiliaries = [
      ["む", "推量・意志・勧誘", "過去"],
      ["き", "直接経験の過去", "受身"],
      ["べし", "推量・当然・可能・意志", "完了"],
      ["ず", "打消", "尊敬"],
      ["けり", "過去・詠嘆", "使役"],
    ];
    const [word, meaning, wrong] = choice(variantIndex, auxiliaries);
    return withVariantId(base, variantIndex, {
      prompt: `${variantContext(variantIndex)}。古文の助動詞「${word}」が文脈により表しやすい意味はどれか。`,
      choices: [meaning, wrong, "比較", "限定"],
      answerIndex: 0,
      explanation: `「${word}」は主に${meaning}などを表す。`,
    });
  }
  const [cue, answer] = choice(variantIndex, cues);
  return withVariantId(base, variantIndex, {
    prompt: `${variantContext(variantIndex)}。評論文で「${cue}」という表現が出たとき、読解上の手がかりとして最も適切なのはどれか。`,
    choices: [answer, "文字数が多い段落だけを読む", "固有名詞をすべて無視する", "本文の結論を必ず撤回する"],
    answerIndex: 0,
    explanation: `「${cue}」は論理関係を読む重要な合図になる。`,
  });
}

function makeScienceVariant(base, variantIndex) {
  if (base.id.includes("density")) {
    const mass = (variantIndex % 200) + 10;
    const volume = (Math.floor(variantIndex / 200) % 20) + 1;
    const density = mass / volume;
    return withVariantId(base, variantIndex, {
      prompt: `質量${mass}g、体積${volume}cm^3 の物体の密度はどれか。`,
      choices: [`${density.toFixed(1)}g/cm^3`, `${(mass + volume).toFixed(1)}g/cm^3`, `${(volume / mass).toFixed(1)}g/cm^3`, `${(mass - volume).toFixed(1)}g/cm^3`],
      answerIndex: 0,
      explanation: `密度は質量÷体積なので ${mass}÷${volume} = ${density.toFixed(1)}g/cm^3。`,
    });
  }
  if (base.id.includes("force") || base.id.includes("momentum")) {
    const mass = (variantIndex % 50) + 2;
    const velocity = (Math.floor(variantIndex / 50) % 20) + 1;
    const momentum = mass * velocity;
    return withVariantId(base, variantIndex, {
      prompt: `質量${mass}kgの物体が秒速${velocity}mで動くとき、運動量の大きさはどれか。`,
      choices: [
        `${momentum}kg m/s`,
        `${momentum + mass + velocity + 1}kg m/s`,
        `${Math.max(0, momentum - mass - velocity - 1)}kg m/s`,
        `${momentum + 2 * mass + 3 * velocity + 5}kg m/s`,
      ],
      answerIndex: 0,
      explanation: `運動量は質量×速度なので ${mass}×${velocity} = ${momentum}。`,
    });
  }
  const concepts = base.id.includes("photosynthesis") || base.id.includes("enzyme")
    ? [
        ["光合成", "光・二酸化炭素・水", "植物が有機物をつくる反応"],
        ["酵素", "特定の反応を進める触媒", "生体内の反応を進める物質"],
        ["基質特異性", "酵素が特定の基質に働きやすい性質", "酵素は特定の基質と結びつきやすい。"],
        ["呼吸", "有機物からエネルギーを取り出す反応", "細胞は呼吸で生命活動に必要なエネルギーを得る。"],
      ]
    : [
        ["化学平衡", "正反応と逆反応の速度が等しい", "見かけ上濃度が一定になる状態"],
        ["中和", "酸と塩基が反応し水などを生じる", "酸性と塩基性が打ち消し合う反応"],
        ["酸化", "物質が酸素と結びつく、または電子を失う変化", "酸化還元では電子の移動にも注目する。"],
        ["電離", "物質が水溶液中でイオンに分かれること", "酸や塩基の性質を考える基礎になる。"],
      ];
  const [term, answer, explanation] = choice(variantIndex, concepts);
  return withVariantId(base, variantIndex, {
    prompt: `${variantContext(variantIndex)}。${term}について最も適切な説明はどれか。`,
    choices: [answer, "必ず温度を0にする現象", "物質が存在できない状態", "電流だけで決まる制度"],
    answerIndex: 0,
    explanation,
  });
}

function makeSocialVariant(base, variantIndex) {
  const facts = base.id.includes("geography")
    ? [
        ["等高線", "間隔が狭いほど傾斜が急", "短い距離で高度差が大きいことを示す。"],
        ["時差", "経度15度につき約1時間生じる", "地球は24時間で360度回転する。"],
        ["扇状地", "山地から平地へ出た川が土砂を堆積してできる地形", "河川の働きで形成される地形。"],
        ["季節風", "季節によって向きが変わる風", "大陸と海洋の温まり方の違いが関係する。"],
      ]
    : base.id.includes("modern")
      ? [
          ["殖産興業", "明治政府が近代産業を育成した政策", "明治期の近代化政策の一つ。"],
          ["地租改正", "土地所有者に地価を基準として税を課した改革", "明治政府の財政基盤整備につながった。"],
          ["版籍奉還", "大名が土地と人民を朝廷へ返した政策", "中央集権化への過程の一つ。"],
          ["廃藩置県", "藩を廃止して府県を置いた政策", "中央政府による地方統治を強めた。"],
        ]
      : [
          ["国会", "国の唯一の立法機関である", "日本国憲法は国会を唯一の立法機関と定める。"],
          ["違憲立法審査権", "法令が憲法に反しないかを裁判所が審査する権限", "裁判所が憲法適合性を判断する権限。"],
          ["権力分立", "権力を複数の機関に分け、相互に抑制させる", "権力集中を防ぐ考え方。"],
          ["基本的人権", "人が生まれながらに持つ基本的な権利", "日本国憲法の三大原理の一つ。"],
        ];
  const [term, answer, explanation] = choice(variantIndex, facts);
  return withVariantId(base, variantIndex, {
    prompt: `${variantContext(variantIndex)}。${term}について最も適切な説明はどれか。`,
    choices: [answer, "内閣が自由に廃止できる私的制度", "裁判だけを禁止する仕組み", "地方公共団体が条約を結ぶ権限"],
    answerIndex: 0,
    explanation,
  });
}

function makeQuestionVariant(base, variantIndex) {
  if (variantIndex === 0) {
    return { ...base };
  }
  if (base.subject === "数学") return makeMathVariant(base, variantIndex);
  if (base.subject === "英語") return makeEnglishVariant(base, variantIndex);
  if (base.subject === "国語") return makeJapaneseVariant(base, variantIndex);
  if (base.subject === "理科") return makeScienceVariant(base, variantIndex);
  return makeSocialVariant(base, variantIndex);
}

function expandQuestionPool(questions) {
  return questions.flatMap((question) =>
    Array.from({ length: STUDY_QUIZ_VARIANTS_PER_BASE }, (_, variantIndex) => makeQuestionVariant(question, variantIndex)),
  );
}

studyQuizQuestions.splice(0, studyQuizQuestions.length, ...expandQuestionPool(studyQuizQuestions));
for (const schoolId of Object.keys(targetExamQuestions)) {
  targetExamQuestions[schoolId].splice(0, targetExamQuestions[schoolId].length, ...expandQuestionPool(targetExamQuestions[schoolId]));
}

export const studyQuizBaseQuestionCount = baseStudyQuizQuestionCount + baseTargetExamQuestionCount;
export const studyQuizTotalQuestionCount =
  studyQuizQuestions.length + Object.values(targetExamQuestions).reduce((total, questions) => total + questions.length, 0);
export const studyQuizQuestionMultiplier = studyQuizTotalQuestionCount / studyQuizBaseQuestionCount;

export const events = [
  {
    id: "rival_school",
    title: "ライバル校の挑発",
    speaker: "ライバル校の不良",
    message: "売られた喧嘩を買わずに睨みだけで返した。余計な火種は消えた。",
    effects: { academics: 0, trust: 1, face: 2, looks: 0, stamina: -3, stress: 2 },
    minTurn: 16,
    chance: 0.08,
  },
  {
    id: "friend_panic",
    title: "仲間の進路相談",
    speaker: "舎弟",
    message: "話を聞いたら、自分の焦りも少し言葉になった。",
    effects: { academics: 1, trust: 3, face: 0, looks: 0, stamina: -2, stress: -2 },
    minTurn: 24,
    chance: 0.07,
  },
  {
    id: "teacher_warning",
    title: "生活指導の呼び出し",
    speaker: "生活指導の先生",
    message: "廊下の説教は長い。だが願書の締切も教えてもらった。",
    effects: { academics: 2, trust: 0, face: -3, looks: -1, stamina: -2, stress: 3 },
    minTurn: 32,
    chance: 0.07,
    gateStat: "face",
    gateBelowOrEqual: 45,
  },
  {
    id: "burnout_hint",
    title: "深夜の集中切れ",
    speaker: "受験番長",
    message: "目が滑る。今日は単語帳を閉じる勇気も必要だ。",
    effects: { academics: -2, trust: 0, face: 0, looks: 1, stamina: 5, stress: -7 },
    minTurn: 56,
    chance: 0.1,
    gateStat: "stress",
    gateBelowOrEqual: 100,
  },
  {
    id: "exam_ticket_panic",
    title: "受験票が消えた夜",
    speaker: "舎弟",
    message: "受験票がないと大騒ぎになった。机も鞄も総ざらいして、最後は単語帳の間から見つかった。",
    effects: { academics: 3, trust: 4, face: -2, looks: -2, stamina: -8, stress: 8 },
    minTurn: 120,
    chance: 0.04,
  },
  {
    id: "principal_truce",
    title: "校長室の休戦協定",
    speaker: "校長",
    message: "番長の顔で揉め事を収め、受験生として自習室の鍵も預かった。なぜか校内が静かになった。",
    effects: { academics: 3, trust: 2, face: 3, looks: 1, stamina: -4, stress: -3 },
    minTurn: 96,
    chance: 0.04,
    gateStat: "trust",
    gateBelowOrEqual: 100,
  },
];
