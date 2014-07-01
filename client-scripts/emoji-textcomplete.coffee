exports = window.emojiExtended =
  addCompletion: (object, cb) ->
    this.ready.then (addTextComplete) ->
      addTextComplete object, cb
    , cb
    null
  path: "#{RELATIVE_PATH}/plugins/nodebb-plugin-emoji-extended/images/"
  getPath: (name) -> if name? then "#{this.path}#{encodeURIComponent name.toLowerCase()}.png" else this.path
  list: [
    "+1", "-1", "100", "109", "1234", "8ball", "a", "ab", "abc", "abcd", "accept", "aerial_tramway", "airplane",
    "alarm_clock", "alien", "ambulance", "anchor", "angel", "anger", "angry", "anguished", "ant", "apple", "aquarius",
    "aries", "arrow_backward", "arrow_double_down", "arrow_double_up", "arrow_down", "arrow_down_small",
    "arrow_forward", "arrow_heading_down", "arrow_heading_up", "arrow_left", "arrow_lower_left", "arrow_lower_right",
    "arrow_right", "arrow_right_hook", "arrow_up", "arrow_up_down", "arrow_up_small", "arrow_upper_left",
    "arrow_upper_right", "arrows_clockwise", "arrows_counterclockwise", "art", "articulated_lorry", "astonished", "atm",
    "b", "baby", "baby_bottle", "baby_chick", "baby_symbol", "baggage_claim", "balloon", "ballot_box_with_check",
    "bamboo", "banana", "bangbang", "bank", "bar_chart", "barber", "baseball", "basketball", "bath", "bathtub",
    "battery", "bear", "beer", "beers", "beetle", "beginner", "bell", "bento", "bicyclist", "bike", "bikini", "bird",
    "birthday", "black_circle", "black_joker", "black_nib", "black_square", "black_square_button", "blossom",
    "blowfish", "blue_book", "blue_car", "blue_heart", "blush", "blush", "boar", "boat", "bomb", "book", "bookmark",
    "bookmark_tabs", "books", "boom", "boot", "bouquet", "bow", "bowling", "bowtie", "boy", "bread", "bride_with_veil",
    "bridge_at_night", "briefcase", "broken_heart", "broken_heart", "bug", "bulb", "bullettrain_front",
    "bullettrain_side", "bus", "busstop", "bust_in_silhouette", "busts_in_silhouette", "cactus", "cake", "calendar",
    "calling", "camel", "camera", "cancer", "candy", "capital_abcd", "capricorn", "car", "card_index", "carousel_horse",
    "cat", "cat2", "cd", "chart", "chart_with_downwards_trend", "chart_with_upwards_trend", "checkered_flag",
    "cherries", "cherry_blossom", "chestnut", "chicken", "children_crossing", "chocolate_bar", "christmas_tree",
    "church", "cinema", "circus_tent", "city_sunrise", "city_sunset", "cl", "clap", "clapper", "clipboard", "clock1",
    "clock10", "clock1030", "clock11", "clock1130", "clock12", "clock1230", "clock130", "clock2", "clock230", "clock3",
    "clock330", "clock4", "clock430", "clock5", "clock530", "clock6", "clock630", "clock7", "clock730", "clock8",
    "clock830", "clock9", "clock930", "closed_book", "closed_lock_with_key", "closed_umbrella", "cloud", "clubs", "cn",
    "cocktail", "coffee", "cold_sweat", "collision", "computer", "confetti_ball", "confounded", "confounded",
    "confused", "congratulations", "construction", "construction_worker", "convenience_store", "cookie", "cool", "cop",
    "copyright", "corn", "couple", "couple_with_heart", "couplekiss", "cow", "cow2", "credit_card", "crocodile",
    "crossed_flags", "crown", "cry", "crying_cat_face", "crystal_ball", "cupid", "curly_loop", "currency_exchange",
    "curry", "custard", "customs", "cyclone", "dancer", "dancers", "dango", "dart", "dash", "date", "de",
    "deciduous_tree", "department_store", "diamond_shape_with_a_dot_inside", "diamonds", "disappointed", "disappointed",
    "dizzy", "dizzy_face", "do_not_litter", "dog", "dog2", "dollar", "dolls", "dolphin", "door", "doughnut", "dragon",
    "dragon_face", "dress", "dromedary_camel", "droplet", "dvd", "e-mail", "ear", "ear_of_rice", "earth_africa",
    "earth_americas", "earth_asia", "egg", "eggplant", "eight", "eight_pointed_black_star", "eight_spoked_asterisk",
    "electric_plug", "elephant", "email", "end", "envelope", "es", "euro", "european_castle", "european_post_office",
    "evergreen_tree", "exclamation", "expressionless", "eyeglasses", "eyes", "facepunch", "factory", "fallen_leaf",
    "family", "fast_forward", "fax", "fearful", "feelsgood", "feet", "ferris_wheel", "file_folder", "finnadie", "fire",
    "fire_engine", "fireworks", "first_quarter_moon", "first_quarter_moon_with_face", "fish", "fish_cake",
    "fishing_pole_and_fish", "fist", "five", "flags", "flashlight", "floppy_disk", "flower_playing_cards", "flushed",
    "flushed", "foggy", "football", "fork_and_knife", "fountain", "four", "four_leaf_clover", "fr", "free",
    "fried_shrimp", "fries", "frog", "frowning", "fuelpump", "full_moon", "full_moon_with_face", "game_die", "gb",
    "gem", "gemini", "ghost", "gift", "gift_heart", "girl", "globe_with_meridians", "goat", "goberserk", "godmode",
    "golf", "grapes", "green_apple", "green_book", "green_heart", "grey_exclamation", "grey_question", "grimacing",
    "grin", "grinning", "guardsman", "guitar", "gun", "haircut", "hamburger", "hammer", "hamster", "hand", "handbag",
    "hankey", "hash", "hatched_chick", "hatching_chick", "headphones", "hear_no_evil", "heart", "heart",
    "heart_decoration", "heart_eyes", "heart_eyes_cat", "heartbeat", "heartpulse", "hearts", "heavy_check_mark",
    "heavy_division_sign", "heavy_dollar_sign", "heavy_exclamation_mark", "heavy_minus_sign", "heavy_multiplication_x",
    "heavy_plus_sign", "helicopter", "herb", "hibiscus", "high_brightness", "high_heel", "hocho", "honey_pot",
    "honeybee", "horse", "horse_racing", "hospital", "hotel", "hotsprings", "hourglass", "hourglass_flowing_sand",
    "house", "house_with_garden", "hurtrealbad", "hushed", "ice_cream", "icecream", "id", "ideograph_advantage", "imp",
    "inbox_tray", "incoming_envelope", "information_desk_person", "information_source", "innocent", "interrobang",
    "iphone", "it", "izakaya_lantern", "jack_o_lantern", "japan", "japanese_castle", "japanese_goblin", "japanese_ogre",
    "jeans", "joy", "joy_cat", "jp", "key", "keycap_ten", "kimono", "kiss", "kissing", "kissing_cat",
    "kissing_closed_eyes", "kissing_heart", "kissing_heart", "kissing_smiling_eyes", "koala", "koko", "kr",
    "large_blue_circle", "large_blue_diamond", "large_orange_diamond", "last_quarter_moon",
    "last_quarter_moon_with_face", "laughing", "leaves", "ledger", "left_luggage", "left_right_arrow",
    "leftwards_arrow_with_hook", "lemon", "leo", "leopard", "libra", "light_rail", "link", "lips", "lipstick", "lock",
    "lock_with_ink_pen", "lollipop", "loop", "loudspeaker", "love_hotel", "love_letter", "low_brightness", "m", "mag",
    "mag_right", "mahjong", "mailbox", "mailbox_closed", "mailbox_with_mail", "mailbox_with_no_mail", "man",
    "man_with_gua_pi_mao", "man_with_turban", "mans_shoe", "maple_leaf", "mask", "mask", "massage", "meat_on_bone",
    "mega", "melon", "memo", "mens", "metal", "metro", "microphone", "microscope", "milky_way", "minibus", "minidisc",
    "mobile_phone_off", "money_with_wings", "moneybag", "monkey", "monkey_face", "monorail", "moon", "mortar_board",
    "mount_fuji", "mountain_bicyclist", "mountain_cableway", "mountain_railway", "mouse", "mouse2", "movie_camera",
    "moyai", "muscle", "mushroom", "musical_keyboard", "musical_note", "musical_score", "mute", "nail_care",
    "name_badge", "neckbeard", "necktie", "negative_squared_cross_mark", "neutral_face", "new", "new_moon",
    "new_moon_with_face", "newspaper", "ng", "nine", "no_bell", "no_bicycles", "no_entry", "no_entry_sign", "no_good",
    "no_mobile_phones", "no_mouth", "no_pedestrians", "no_smoking", "non-potable_water", "nose", "notebook",
    "notebook_with_decorative_cover", "notes", "nut_and_bolt", "o", "o2", "ocean", "octocat", "octopus", "oden",
    "office", "ok", "ok_hand", "ok_woman", "older_man", "older_woman", "on", "oncoming_automobile", "oncoming_bus",
    "oncoming_police_car", "oncoming_taxi", "one", "open_file_folder", "open_hands", "open_mouth", "ophiuchus",
    "orange_book", "outbox_tray", "ox", "page_facing_up", "page_with_curl", "pager", "palm_tree", "panda_face",
    "paperclip", "parking", "part_alternation_mark", "partly_sunny", "passport_control", "paw_prints", "peach", "pear",
    "pencil", "pencil2", "penguin", "pensive", "pensive", "performing_arts", "persevere", "person_frowning",
    "person_with_blond_hair", "person_with_pouting_face", "phone", "pig", "pig2", "pig_nose", "pill", "pineapple",
    "pisces", "pizza", "point_down", "point_left", "point_right", "point_up", "point_up_2", "police_car", "poodle",
    "poop", "post_office", "postal_horn", "postbox", "potable_water", "pouch", "poultry_leg", "pound", "pouting_cat",
    "pray", "princess", "punch", "purple_heart", "purse", "pushpin", "put_litter_in_its_place", "question", "rabbit",
    "rabbit2", "racehorse", "radio", "radio_button", "rage", "rage", "rage1", "rage2", "rage3", "rage4", "railway_car",
    "rainbow", "raised_hand", "raised_hands", "ram", "ramen", "rat", "recycle", "red_car", "red_circle", "registered",
    "relaxed", "relaxed", "relieved", "repeat", "repeat_one", "restroom", "revolving_hearts", "rewind", "ribbon",
    "rice", "rice_ball", "rice_cracker", "rice_scene", "ring", "rocket", "roller_coaster", "rooster", "rose",
    "rotating_light", "round_pushpin", "rowboat", "ru", "rugby_football", "runner", "running",
    "running_shirt_with_sash", "sa", "sagittarius", "sailboat", "sake", "sandal", "santa", "satellite", "satisfied",
    "saxophone", "school", "school_satchel", "scissors", "scorpius", "scream", "scream", "scream_cat", "scroll", "seat",
    "secret", "see_no_evil", "seedling", "seven", "shaved_ice", "sheep", "shell", "ship", "shipit", "shirt", "shit",
    "shoe", "shower", "signal_strength", "six", "six_pointed_star", "ski", "skull", "sleeping", "sleepy",
    "slot_machine", "small_blue_diamond", "small_orange_diamond", "small_red_triangle", "small_red_triangle_down",
    "smile", "smile_cat", "smiley", "smiley", "smiley_cat", "smiling_imp", "smirk", "smirk", "smirk_cat", "smoking",
    "snail", "snake", "snowboarder", "snowflake", "snowman", "sob", "sob", "soccer", "soon", "sos", "sound",
    "space_invader", "spades", "spaghetti", "sparkler", "sparkles", "sparkling_heart", "speak_no_evil", "speaker",
    "speech_balloon", "speedboat", "squirrel", "star", "star2", "stars", "station", "statue_of_liberty",
    "steam_locomotive", "stew", "straight_ruler", "strawberry", "stuck_out_tongue", "stuck_out_tongue_closed_eyes",
    "stuck_out_tongue_closed_eyes", "stuck_out_tongue_winking_eye", "stuck_out_tongue_winking_eye", "sun_with_face",
    "sunflower", "sunglasses", "sunny", "sunrise", "sunrise_over_mountains", "surfer", "sushi", "suspect",
    "suspension_railway", "sweat", "sweat_drops", "sweat_smile", "sweet_potato", "swimmer", "symbols", "syringe",
    "tada", "tanabata_tree", "tangerine", "taurus", "taxi", "tea", "telephone", "telephone_receiver", "telescope",
    "tennis", "tent", "thought_balloon", "three", "thumbsdown", "thumbsup", "ticket", "tiger", "tiger2", "tired_face",
    "tm", "toilet", "tokyo_tower", "tomato", "tongue", "top", "tophat", "tractor", "traffic_light", "train", "train2",
    "tram", "triangular_flag_on_post", "triangular_ruler", "trident", "triumph", "trolleybus", "trollface", "trophy",
    "tropical_drink", "tropical_fish", "truck", "trumpet", "tshirt", "tulip", "turtle", "tv",
    "twisted_rightwards_arrows", "two", "two_hearts", "two_men_holding_hands", "two_women_holding_hands", "u5272",
    "u5408", "u55b6", "u6307", "u6708", "u6709", "u6e80", "u7121", "u7533", "u7981", "u7a7a", "uk", "umbrella",
    "unamused", "underage", "unlock", "up", "us", "v", "vertical_traffic_light", "vhs", "vibration_mode",
    "video_camera", "video_game", "violin", "virgo", "volcano", "vs", "walking", "waning_crescent_moon",
    "waning_gibbous_moon", "warning", "watch", "water_buffalo", "watermelon", "wave", "wavy_dash",
    "waxing_crescent_moon", "waxing_gibbous_moon", "wc", "weary", "wedding", "whale", "whale2", "wheelchair",
    "white_check_mark", "white_circle", "white_flower", "white_square", "white_square_button", "wind_chime",
    "wine_glass", "wink", "wink", "wink2", "wolf", "woman", "womans_clothes", "womans_hat", "womens", "worried",
    "wrench", "x", "yellow_heart", "yen", "yum", "zap", "zero", "zzz"
  ]
  ready: new Promise (resolve, reject) ->
    $(document).ready -> socket.emit 'modules.emojiExtended', null, (err, data) ->
      if err?
        console.error "Error while initializing emoji-extended."
        console.error err
        return reject err
      maxCount = data.maxCount
      minChars = data.minChars
      completePrefix = data.completePrefix
      zoom = data.zoom
      emojiSize = 20
      if zoom > 0
        zoom = 512 if zoom > 512
        $('head').append """
            <style type="text/css">
              .emoji {
                transition: z-index,margin,width,height;
                transition-timing-function: ease-in-out;
                transition-duration: 0.2s;
                transition-delay: 0.2s;
                z-index: 0;
              }
              .emoji:hover {
                width: #{zoom}px;
                height: #{zoom}px;
                margin: #{-(zoom-emojiSize)/2}px;
                z-index: #{zoom};
              }
            </style>
            """

      # returns zero if the line-end may not be within an inline code-tag whatever may follow. takes O(length)
      isInlineCodeContext = (line) ->
        beginSize = 0 # amount of accents that began the current possible code-content
        currentSize = 0 # amount of accents at current possible code-end
        escaped = false # last char was backslash
        begin = true # before or within possible code-begin
        since = '' # string since last code-begin
        ignoreSince = /^\s+`*$/ # regex that matches non-code-content (`` `` is not closing)
        for char in line
          if char == '`' && !(escaped && begin) && !ignoreSince.test since
            if begin then beginSize++ else currentSize++; since += char
          else if currentSize == beginSize && beginSize # found end of code
            beginSize = currentSize = 0
            begin = true
            since = ''
          else
            if begin && beginSize
              begin = false
            since += char
            currentSize = 0
          escaped = (char == '\\')
        beginSize

      codeInListRegex = (indent) ->
        #                 space only | tab only      | tab space    | space tab
        if indent == 3 then /^( {8}\s|( {0,3}\t){2}\s| {0,3}\t {4}\s| {4,7}\t\s)/ else
          new RegExp "^( {#{indent + 6}}|( {0,3}\\t){2}| {0,3}\\t( {0,#{indent + 2}})| {4,7}\\t)"
      #                      space only | tab only     | tab space                   | space tab

      # checks whether the current line is within a code-block (handles lists, doesn't handle quotes)
      isBlockCodeContext = (lines) ->
        list = false
        code = false
        prevEmpty = true
        emptyR = /^\s*$/
        listR = /^( {0,3})[\+*-]\s/
        codeR = /^ {4,}| {0,3}\t/
        codeInList = null
        for line in lines
          empty = emptyR.test line
          list = (list && !(prevEmpty && empty))
          if l = line.match listR
            list = true
            codeInList = codeInListRegex l[1].length
          code = list && codeInList.test(line) || !list && (prevEmpty || code) && codeR.test line
          prevEmpty = empty
        code

      # returns whether the end of the term (last line, EOL) cannot be within code-context (no possible suffix)
      isSmileyContext = (term) ->
        lines = term.match(/^.*$/gm)
        return !(isInlineCodeContext(lines[lines.length - 1]) || isBlockCodeContext lines)

      resolve.call exports, (object, cb) ->
        object = $ object if !(object instanceof $)
        if object.data 'emoji-extended-added'
          cb new Error 'Already added' if typeof cb == 'function'
          return
        object.data 'emoji-extended-added', '1'
        object.textcomplete [
          #  anything before not ending with $completePrefix   : any words/numbers/+/-, count from minChars to any
          match: new RegExp "^((([\\s\\S]*)(#{completePrefix})):[\\w\\d+-]{#{minChars},})$", "i"
          search: (term, callback) ->
            if !isSmileyContext term
              callback []
              return;
            smileyPrefix = term.match(/:([\w\d\+-]*)$/)[1]
            regexp = new RegExp '^' + (smileyPrefix.replace /\+/g, '\\+'), 'i'
            callback $.grep exports.list, (emoji) -> regexp.test emoji
          replace: (value) -> '$2:' + value.toLowerCase() + ': '
          template: (value) ->
            "<img class='emoji emoji-extended img-responsive' src='#{exports.getPath value}' /> #{value}"
          maxCount: maxCount
          index: 1
        ]
        object.closest('.textcomplete-wrapper').css('height', '100%').find('textarea').css 'height', '100%'
        cb() if typeof cb == 'function'

$(window).on 'action:composer.loaded', (ignored, data) -> exports.addCompletion $ "#cmp-uuid-#{data.post_uuid} .write"
$(window).on 'action:chat.loaded', -> exports.addCompletion $ "#chat-message-input"
$(window).trigger 'emoji-extended:initialized', exports