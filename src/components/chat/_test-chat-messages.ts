import { ChatMessage } from '../../types'

export const TEST_CHAT_MESSAGES: ChatMessage[] = [
  {
    role: 'user',
    content: '天空是',
  },
  {
    role: 'assistant',
    content:
      '大气圈中的一部分，其主要成分是氮气、氧气和少量其他气体。天空呈现出不同的颜色和形态，包括蓝色、紫色、橘黄色和红色。这是由于光线在大气中的折射和散射所造成的。天空也是我们观察天体、预测天气和探索气候变化的重要资源。',
  },
  {
    role: 'user',
    content: '完成下面的句子：\n天空是',
  },
  {
    role: 'assistant',
    content: '广阔而蔚蓝的。',
  },
  {
    role: 'user',
    content: 'Q: 为什么天空是蓝的？\nA:',
  },
  {
    role: 'assistant',
    content:
      '天空看起来蓝色是因为光线被散射了。太阳的光线包含了各种颜色的光，其中蓝色光的波长比其他颜色的光短，所以蓝色光更容易被空气分子散射，比较容易扩散在空气中。这就是为什么我们看到的天空是蓝色的。在太阳落下和升起的时候，光线需要穿过大气层更多的空气，所以蓝光被更多地散射，而红色和黄色的光则会被过滤掉，因此天空呈现出了橙色或红色的颜色。',
  },
  {
    role: 'user',
    content:
      'This is awesome! // Positive\nThis is bad! // Negative\nWow that movie was rad! // Positive\nWhat a horrible show! //',
  },
  {
    role: 'assistant',
    content: 'Negative',
  },
  {
    role: 'user',
    content:
      "This is awesome! // Positive\nThis is bad! // Negative\nWow that movie was rad! // Positive\nIt's a sunny day! //",
  },
  {
    role: 'assistant',
    content: 'Positive',
  },
  {
    role: 'user',
    content: '将以下文本翻译成西班牙语：\n文本：“hello！”',
  },
  {
    role: 'assistant',
    content: 'Texto: ¡hola!',
  },
  {
    role: 'user',
    content:
      '提取以下文本中的地名。\n所需格式：\n地点：<逗号分隔的公司名称列表>\n输入：“虽然这些发展对研究人员来说是令人鼓舞的，但仍有许多谜团。里斯本未知的香帕利莫德中心的神经免疫学家Henrique Veiga-Fernandes说：“我们经常在大脑和我们在周围看到的效果之间有一个黑匣子。”“如果我们想在治疗背景下使用它，我们实际上需要了解机制。””',
  },
  {
    role: 'assistant',
    content: '地点：里斯本，香帕利莫德中心',
  },
  {
    role: 'user',
    content:
      'Congratulation\n\n告诉我这个单词的发音、含义、词根，并用这个单词造三个附带翻译的句子。',
  },
  {
    role: 'assistant',
    content: `好的，以下是关于单词 "Congratulation" 的信息和例句：

### 发音
英式发音：/kənˌɡrætjʊˈleɪʃ(ə)n/，美式发音：/kənˌɡrætʃəˈleɪʃ(ə)n/。你可以在 [Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/congratulation) 网站上找到它的发音。
    
### 含义
单词 "Congratulation" 的含义是祝贺、庆祝。它通常用于表达对他人成功、喜悦或其他特殊的事件表示祝贺。
    
### 词根
单词 "Congratulation" 的词根来自拉丁语 "congratulatio"，意思是 "expressing joy or delight"。
    
### 例句：
1. Congratulation on winning the first prize in the piano competition. （恭喜你在钢琴比赛中获得一等奖。）
2. I want to extend my congratulation to you on your graduation. （我想向你表示在你毕业之际表示祝贺。）
3. Congratulation to my best friend on her wedding. （祝我最好的朋友新婚快乐！）`,
  },
  {
    role: 'user',
    content: 'preference 一般简写成什么',
  },
  {
    role: 'assistant',
    content: '单词"preference"的一般简写形式是"pref."。',
  },
  {
    role: 'user',
    content: '表示 "进行中、处理中" 的英文单词有哪些，越短越好',
  },
  {
    role: 'assistant',
    content: `进行中、处理中的英文单词包括：

- Ongoing
- Processing
- In progress
- Underway
- Pending
- Active
- Continuing
- Developing
- Advancing
- Executing
    
以上都是比较常用、较短的表示"进行中、处理中"的英文单词。`,
  },
  {
    role: 'user',
    content: '用 transfer 这个单词造一些英文句子并附带其中文翻译',
  },
  {
    role: 'assistant',
    content: `1. I need to transfer some money to my friend's account. (我需要转账给我朋友的账户。)
2. The employee requested a transfer to another department. (那个员工要求转移到另一个部门。)
3. We will transfer the files to the new computer later. (我们稍后会把文件转移至新电脑。)
4. The hotel offers a free shuttle transfer from the airport. (酒店提供从机场免费接送服务。)
5. The company decided to transfer the production to a cheaper country. (公司决定将生产转移到一个更便宜的国家。)
    
以上为几个用 transfer 这个单词造成的英文句子，同时附带其中文翻译。`,
  },
]
