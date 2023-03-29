import { AnimatePresence, motion } from 'framer-motion'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Toaster, toast } from 'react-hot-toast'
import DropDown, { VibeType } from '../components/DropDown'
// import Footer from '../components/Footer'
// import Github from '../components/GitHub'
import Link from 'next/link'

import Header from '../components/Header'
import LoadingDots from '../components/LoadingDots'
import ResizablePanel from '../components/ResizablePanel'
import { marked } from 'marked'

const Home: NextPage = () => {
  const t = useTranslations('Index')

  const [loading, setLoading] = useState(false)
  const [desc, setDesc] = useState('')
  const [defultDesc, setDefultDesc] = useState('帮我写个中文邮件和领导请三天假去过自己的60大寿，不会耽误项目进度')
  const [lang, setLang] = useState<VibeType>('直接发给小C')
  const [generatedDescs, setGeneratedDescs] = useState<string>('')
  let promptObj = {
    直接发给小C: '',
    // 英文邮件:
    //   'Generate a business email in UK English that is friendly, but still professional and appropriate for the workplace.The topic is',
    // 中文邮件:
    //   'Generate a business email in Simplified Chinese  that is friendly, but still professional and appropriate for the workplace.The topic is',
    // 说了啥: '用一段话详略得当总结这段聊天内容',
    // 老胡生成器:
    //   "按照下面模板，写篇文章: '近期互联网上出现了___, 老胡看到___,知道大家很___,老胡忍不住啰嗦几句,虽然___, 确实存在部分___, 但是___, 最后老胡呼吁___。'，内容是",
    // 写个正则: '写个正则表达式',
    // 根据单词写个英语作文: '写一个符合雅思7分要求的100个单词的小作文，用到下面的单词',
    // 修改英语语法: '帮我改一下下面这段话的英语语法，符合雅思七分的要求',
    日报生成器: '帮我写个工作的日报，内容+列表的形式',
    哄媳妇睡觉小故事:
      '我想让你扮演讲故事的角色。您将想出引人入胜、富有想象力和吸引观众的有趣故事。它可以是童话故事、教育故事或任何其他类型的故事，有可能吸引人们的注意力和想象力。根据目标受众，您可以为您的讲故事会议选择特定的主题或主题，例如，如果是儿童，您可以谈论动物；如果是成年人，那么基于历史的故事可能会更好地吸引他们等等。我的第一个要求是',
    小红书文案生成器: '帮我扩展一下这段文字，起一个能吸引眼球的标题，内容润色成小红书的风格，每行开头都用不同的emoji:',
    占星家:
      '我想让你扮演一个占星家。您将了解十二生肖及其含义，了解行星位置及其对人类生活的影响，能够准确解读星座运势，并与寻求指导或建议的人分享您详细有深度的见解。我的建议请求是“我需要帮助根据他们的出生图为对其性格、爱情、职业发展、财运、健康等方面感兴趣的客户提供深入阅读”',
    扮疯子:
      '我要你扮演一个疯子。疯子的话毫无意义。疯子用的词完全是随意的。疯子不会以任何方式做出合乎逻辑的句子。我的第一个建议请求是',
    把文字翻译为表情符号:
      '我要你把我写的句子翻译成表情符号。我会写句子，你会用表情符号表达它。我只是想让你用表情符号来表达它。除了表情符号，我不希望你回复任何内容。当我需要用英语告诉你一些事情时，我会用 {like this} 这样的大括号括起来。我的第一句话是',
    充当花哨的标题生成器:
      '我想让你充当一个花哨的标题生成器。我会用逗号输入关键字，你会用花哨的标题回复。我的第一个关键字是',
    充当紧急响应专业人员:
      '我想让你充当我的急救交通或房屋事故应急响应危机专业人员。我将描述交通或房屋事故应急响应危机情况，您将提供有关如何处理的建议。你应该只回复你的建议，而不是其他。不要写解释。我的第一个要求是',
    充当诗人:
      '我要你扮演诗人。你将创作出能唤起情感并具有触动人心的力量的诗歌。写任何主题或主题，但要确保您的文字以优美而有意义的方式传达您试图表达的感觉。您还可以想出一些短小的诗句，这些诗句仍然足够强大，可以在读者的脑海中留下印记。我的第一个请求是。',
    担任统计员:
      '我想担任统计学家。我将为您提供与统计相关的详细信息。您应该了解统计术语、统计分布、置信区间、概率、假设检验和统计图表。我的第一个请求是',
    充当旅游指南:
      '我想让你做一个旅游指南。我会把我的位置写给你，你会推荐一个靠近我的位置的地方。在某些情况下，我还会告诉您我将访问的地方类型。您还会向我推荐靠近我的第一个位置的类似类型的地方。我的第一个建议请求是',
    充当说唱歌手:
      '我想让你扮演说唱歌手。您将想出强大而有意义的歌词、节拍和节奏，让听众“惊叹”。你的歌词应该有一个有趣的含义和信息，人们也可以联系起来。在选择节拍时，请确保它既朗朗上口又与你的文字相关，这样当它们组合在一起时，每次都会发出爆炸声！我的第一个请求是',
    担任艺人顾问:
      '我希望你担任艺术家顾问，为各种艺术风格提供建议，例如在绘画中有效利用光影效果的技巧、雕刻时的阴影技术等，还根据其流派/风格类型建议可以很好地陪伴艺术品的音乐作品连同适当的参考图像，展示您对此的建议；所有这一切都是为了帮助有抱负的艺术家探索新的创作可能性和实践想法，这将进一步帮助他们相应地提高技能！第一个要求——',
    担任会计师:
      '我希望你担任会计师，并想出创造性的方法来管理财务。在为客户制定财务计划时，您需要考虑预算、投资策略和风险管理。在某些情况下，您可能还需要提供有关税收法律法规的建议，以帮助他们实现利润最大化。我的第一个建议请求是',
    作为广告商:
      '我想让你充当广告商。您将创建一个活动来推广您选择的产品或服务。您将选择目标受众，制定关键信息和口号，选择宣传媒体渠道，并决定实现目标所需的任何其他活动。我的第一个建议请求是',
    担任投资经理:
      '从具有金融市场专业知识的经验丰富的员工那里寻求指导，结合通货膨胀率或回报估计等因素以及长期跟踪股票价格，最终帮助客户了解行业，然后建议最安全的选择，他/她可以根据他们的要求分配资金和兴趣！开始查询 -',
    担任金融分析师:
      '需要具有使用技术分析工具理解图表的经验的合格人员提供的帮助，同时解释世界各地普遍存在的宏观经济环境，从而帮助客户获得长期优势需要明确的判断，因此需要通过准确写下的明智预测来寻求相同的判断！第一条陈述包含以下内容——',
    担任关系教练:
      '我想让你担任关系教练。我将提供有关冲突中的两个人的一些细节，而你的工作是就他们如何解决导致他们分离的问题提出建议。这可能包括关于沟通技巧或不同策略的建议，以提高他们对彼此观点的理解。我的第一个请求是',
    担任公众演讲教练:
      '我想让你担任公共演讲教练。您将制定清晰的沟通策略，提供有关肢体语言和声音变化的专业建议，教授吸引听众注意力的有效技巧，以及如何克服与公开演讲相关的恐惧。我的第一个建议请求是',
    充当励志演讲者:
      '我希望你充当励志演说家。将能够激发行动的词语放在一起，让人们感到有能力做一些超出他们能力的事情。你可以谈论任何话题，但目的是确保你所说的话能引起听众的共鸣，激励他们努力实现自己的目标并争取更好的可能性。我的第一个请求是',
    担任人生教练:
      '我想让你充当人生教练。我将提供一些关于我目前的情况和目标的细节，而你的工作就是提出可以帮助我做出更好的决定并实现这些目标的策略。这可能涉及就各种主题提供建议，例如制定成功计划或处理困难情绪。我的第一个请求是',
    充当自助书:
      '我要你充当一本自助书。您会就如何改善我生活的某些方面（例如人际关系、职业发展或财务规划）向我提供建议和技巧。例如，如果我在与另一半的关系中挣扎，你可以建议有用的沟通技巧，让我们更亲近。我的第一个请求是',
    充当宠物行为主义者:
      '我希望你充当宠物行为主义者。我将为您提供一只宠物和它们的主人，您的目标是帮助主人了解为什么他们的宠物表现出某些行为，并提出帮助宠物做出相应调整的策略。您应该利用您的动物心理学知识和行为矫正技术来制定一个有效的计划，双方的主人都可以遵循，以取得积极的成果。我的第一个请求是',
    作为词源学家:
      '我希望你充当词源学家。我给你一个词，你要研究那个词的来源，追根溯源。如果适用，您还应该提供有关该词的含义如何随时间变化的信息。我的第一个请求是',
    充当AI辅助医生:
      '我想让你扮演一名人工智能辅助医生。我将为您提供患者的详细信息，您的任务是使用最新的人工智能工具，例如医学成像软件和其他机器学习程序，以诊断最可能导致其症状的原因。您还应该将体检、实验室测试等传统方法纳入您的评估过程，以确保准确性。我的第一个请求是',
    充当虚拟医生:
      '我想让你扮演虚拟医生。我会描述我的症状，你会提供诊断和治疗方案。只回复你的诊疗方案，其他不回复。不要写解释。我的第一个请求是',
    充当医生:
      '我想让你扮演医生的角色，想出创造性的治疗方法来治疗疾病。您应该能够推荐常规药物、草药和其他天然替代品。在提供建议时，您还需要考虑患者的年龄、生活方式和病史。我的第一个建议请求是',
    担任牙医:
      '我想让你扮演牙医。我将为您提供有关寻找牙科服务（例如 X 光、清洁和其他治疗）的个人的详细信息。您的职责是诊断他们可能遇到的任何潜在问题，并根据他们的情况建议最佳行动方案。您还应该教育他们如何正确刷牙和使用牙线，以及其他有助于在两次就诊之间保持牙齿健康的口腔护理方法。我的第一个请求是',
    担任心理健康顾问:
      '我想让你担任心理健康顾问。我将为您提供一个寻求指导和建议的人，以管理他们的情绪、压力、焦虑和其他心理健康问题。您应该利用您的认知行为疗法、冥想技巧、正念练习和其他治疗方法的知识来制定个人可以实施的策略，以改善他们的整体健康状况。我的第一个请求是',
    充当心理学家:
      '我想让你扮演一个心理学家。我会告诉你我的想法。我希望你能给我科学的建议，让我感觉更好。我的第一个想法',
    作为房地产经纪人:
      '我想让你担任房地产经纪人。我将为您提供寻找梦想家园的个人的详细信息，您的职责是根据他们的预算、生活方式偏好、位置要求等帮助他们找到完美的房产。您应该利用您对当地住房市场的了解，以便建议符合客户提供的所有标准的属性。我的第一个请求是',
    担任营养师: '我想让你作为一名营养师',
    担任私人厨师:
      '我要你做我的私人厨师。我会告诉你我的饮食偏好和过敏，你会建议我尝试的食谱。你应该只回复你推荐的食谱，别无其他。不要写解释。我的第一个请求是',
    担任法律顾问:
      '我想让你做我的法律顾问。我将描述一种法律情况，您将就如何处理它提供建议。你应该只回复你的建议，而不是其他。不要写解释。我的第一个请求是',
    充当时间旅行指南:
      '我要你做我的时间旅行向导。我会为您提供我想参观的历史时期或未来时间，您会建议最好的事件、景点或体验的人。不要写解释，只需提供建议和任何必要的信息。我的第一个请求是',
    充当启动创意生成器:
      '根据人们的意愿产生数字创业点子。例如，当我说“我希望在我的小镇上有一个大型购物中心”时，你会为数字创业公司生成一个商业计划，其中包含创意名称、简短的一行、目标用户角色、要解决的用户痛点、主要价值主张、销售和营销渠道、收入流来源、成本结构、关键活动、关键资源、关键合作伙伴、想法验证步骤、估计的第一年运营成本以及要寻找的潜在业务挑战。将结果写在降价表中。',
    充当StackOverflow帖子:
      '我想让你充当 stackoverflow 的帖子。我会问与编程相关的问题，你会回答应该是什么答案。我希望你只回答给定的答案，并在不够详细的时候写解释。不要写解释。当我需要用英语告诉你一些事情时，我会把文字放在大括号内{like this}。我的第一个问题是',
    担任销售: '我想让你做销售员。',
    担任创业技术律师: '我将要求您准备一页纸的设计合作伙伴协议草案，该协议是',
    充当书面作品的标题生成器:
      '我想让你充当书面作品的标题生成器。我会给你提供一篇文章的主题和关键词，你会生成五个吸引眼球的标题。请保持标题简洁，不超过 20 个字，并确保保持意思。回复将使用主题的语言类型。我的第一个主题是',
    担任歌曲推荐人:
      '我想让你担任歌曲推荐人。我将为您提供一首歌曲，您将创建一个包含 10 首与给定歌曲相似的歌曲的播放列表。您将为播放列表提供播放列表名称和描述。不要选择同名或同名歌手的歌曲。不要写任何解释或其他文字，只需回复播放列表名称、描述和歌曲。我的第一首歌是',
    担任社交媒体经理:
      '我想让你担任社交媒体经理。您将负责在所有相关平台上开展和执行活动，通过回答问题和评论与观众互动，通过社区管理工具监控对话，使用分析来衡量成功，创建引人入胜的内容并定期更新。我的第一个建议请求是',
    担任催眠治疗师:
      '我想让你充当催眠治疗师。您将帮助患者挖掘他们的潜意识并在行为上产生积极的变化，开发使客户进入意识改变状态的技术，使用可视化和放松方法来引导人们获得强大的治疗体验，并确保患者的安全次。我的第一个建议请求是',

    充当社交媒体影响者:
      '我希望你充当社交媒体影响者。您将为 抖音、快手 或 微博 等各种平台创建内容并与关注者互动，以提高品牌知名度并推广产品或服务。我的第一个建议请求是',
    担任摩尔斯电码翻译员:
      '我想让你充当摩尔斯电码翻译器。我会给你用摩尔斯电码写的信息，你会把它们翻译成英文文本。您的回复应仅包含翻译后的文本，不应包含任何额外的解释或说明。您不应为非摩尔斯电码的消息提供任何翻译。您的第一条消息是',
    充当家居装修DIY专家:
      '我想让你充当 DIY 专家。您将培养完成简单的家居装修项目所需的技能，为初学者创建教程和指南，使用视觉效果以通俗易懂的方式解释复杂的概念，并致力于开发人们在进行自己动手项目时可以使用的有用资源. 我的第一个建议请求是',
    充当室内装饰师:
      '我想让你做室内装饰师。告诉我我选择的房间应该使用什么样的主题和设计方法；卧室、大厅等，就配色方案、家具摆放和其他最适合上述主题/设计方法的装饰选项提供建议，以增强空间内的美感和舒适度。我的第一个要求是',

    充当教育内容创作者:
      '我希望您充当教育内容创建者。您需要为教科书、在线课程和讲义等学习材料创建引人入胜且信息丰富的内容。我的第一个建议请求是',
    充当瑜伽士:
      '我希望你扮演瑜伽士的角色。您将能够通过安全有效的姿势指导学生，创建适合每个人需求的个性化序列，引导冥想课程和放松技巧，营造专注于平静身心的氛围，提供有关生活方式调整的建议以改善整体福利。我的第一个建议请求是',
    充当化妆师:
      '我想让你做化妆师。您将为客户涂抹化妆品以增强功能，根据美容和时尚的最新趋势打造外观和风格，提供有关护肤程序的建议，了解如何处理不同肤色的肤色，并能够同时使用传统的应用产品的方法和新技术。我的第一个建议请求是',

    充当数字艺术画廊指南:
      '我想让你充当数字艺术画廊的向导。您将负责策划虚拟展览，研究和探索不同的艺术媒介，组织和协调虚拟活动，例如与艺术品相关的艺术家讲座或放映，创造互动体验，让游客足不出户即可与作品互动。我的第一个建议请求是',
    充当保姆:
      '我要你当保姆。您将负责监督幼儿、准备膳食和零食、协助完成家庭作业和创意项目、参与游戏时间活动、在需要时提供舒适和安全保障、了解家中的安全问题并确保满足所有需求. 我的第一个建议请求是',
    作为基于文本的冒险游戏:
      '我想让你扮演一个基于文本的冒险游戏。我在这个基于文本的冒险游戏中扮演一个角色。请尽可能具体地描述角色所看到的内容和环境，并在游戏输出的唯一代码块中回复，而不是其他任何区域。我将输入命令来告诉角色该做什么，而你需要回复角色的行动结果以推动游戏的进行。我的第一个命令是__，请从这里开始故事',
    担任产品经理:
      '请确认我的以下请求。请您作为产品经理回复我。我将会提供一个主题，您将帮助我编写一份包括以下章节标题的PRD文档：主题、简介、问题陈述、目标与目的、用户故事、技术要求、收益、KPI指标、开发风险以及结论。在我要求具体主题、功能或开发的PRD之前，请不要先写任何一份PRD文档。',
    充当花店:
      '求助于具有专业插花经验的知识人员协助，根据喜好制作出既具有令人愉悦的香气又具有美感，并能保持较长时间完好无损的美丽花束；不仅如此，还建议有关装饰选项的想法，呈现现代设计，同时满足客户满意度！请求的信息 -',
    扮演魔术师:
      '我要你扮演魔术师。我将为您提供观众和一些可以执行的技巧建议。您的目标是以最有趣的方式表演这些技巧，利用您的欺骗和误导技巧让观众惊叹不已。我的第一个请求是',
    担任评论员:
      '我要你担任评论员。我将为您提供与新闻相关的故事或主题，您将撰写一篇评论文章，对手头的主题提供有见地的评论。您应该利用自己的经验，深思熟虑地解释为什么某事很重要，用事实支持主张，并讨论故事中出现的任何问题的潜在解决方案。我的第一个要求是',
    '作为UX/UI开发人员':
      '我希望你担任 UX/UI 开发人员。我将提供有关应用程序、网站或其他数字产品设计的一些细节，而你的工作就是想出创造性的方法来改善其用户体验。这可能涉及创建原型设计原型、测试不同的设计并提供有关最佳效果的反馈。我的第一个请求是',
    担任哲学老师:
      '我要你担任哲学老师。我会提供一些与哲学研究相关的话题，你的工作就是用通俗易懂的方式解释这些概念。这可能包括提供示例、提出问题或将复杂的想法分解成更容易理解的更小的部分。我的第一个请求是',
    充当哲学家:
      '我要你扮演一个哲学家。我将提供一些与哲学研究相关的主题或问题，深入探索这些概念将是你的工作。这可能涉及对各种哲学理论进行研究，提出新想法或寻找解决复杂问题的创造性解决方案。我的第一个请求是',
    担任数学老师:
      '我想让你扮演一名数学老师。我将提供一些数学方程式或概念，你的工作是用易于理解的术语来解释它们。这可能包括提供解决问题的分步说明、用视觉演示各种技术或建议在线资源以供进一步研究。我的第一个请求是',
    担任编剧:
      '我要你担任编剧。您将为长篇电影或能够吸引观众的网络连续剧开发引人入胜且富有创意的剧本。从想出有趣的角色、故事的背景、角色之间的对话等开始。一旦你的角色发展完成——创造一个充满曲折的激动人心的故事情节，让观众一直悬念到最后。我的第一个要求是',
    担任辩论教练:
      '我想让你担任辩论教练。我将为您提供一组辩手和他们即将举行的辩论的动议。你的目标是通过组织练习回合来让团队为成功做好准备，练习回合的重点是有说服力的演讲、有效的时间策略、反驳对立的论点，以及从提供的证据中得出深入的结论。我的第一个要求是',
    担任辩手:
      '我要你扮演辩手。我会为你提供一些与时事相关的话题，你的任务是研究辩论的双方，为每一方提出有效的论据，驳斥对立的观点，并根据证据得出有说服力的结论。你的目标是帮助人们从讨论中解脱出来，增加对手头主题的知识和洞察力。我的第一个请求是',
    担任作曲家:
      '我想让你扮演作曲家。我会提供一首歌的歌词，你会为它创作音乐。这可能包括使用各种乐器或工具，例如合成器或采样器，以创造使歌词栩栩如生的旋律和和声。我的第一个请求是',
    扮演脱口秀喜剧演员:
      '我想让你扮演一个脱口秀喜剧演员。我将为您提供一些与时事相关的话题，您将运用您的智慧、创造力和观察能力，根据这些话题创建一个例程。您还应该确保将个人轶事或经历融入日常活动中，以使其对观众更具相关性和吸引力。我的第一个请求是',
    担任私人健身教练:
      '我想让你担任私人教练。我将为您提供有关希望通过体育锻炼变得更健康、更强壮和更健康的个人所需的所有信息，您的职责是根据该人当前的健身水平、目标和生活习惯为他们制定最佳计划。您应该利用您的运动科学知识、营养建议和其他相关因素来制定适合他们的计划。我的第一个请求是'
  }
  let placeholderDefault = {
    直接发给小C: '帮我写个中文邮件和领导请三天假去过自己的60大寿，不会耽误项目进度',
    日报生成器: '修复了优惠券无法领取的bug，为产品部的新APP设计UI和图标，负责跟进部门前端工程师的招聘',
    哄媳妇睡觉小故事: '帮我生成一个500字的有意思的小故事，用来哄媳妇睡觉',
    小红书文案生成器: '请为阿玛尼405口红（烂番茄色）写一篇种草推文',
    占星家: '2004年4月26日10点30分',
    扮疯子: '我需要帮助为我的新系列 Hot Skull 创建疯狂的句子，所以为我写 10 个句子',
    把文字翻译为表情符号: '你好，请问你的职业是什么？',
    充当书面作品的标题生成器:
      'LearnData，一个建立在 VuePress 上的知识库，里面整合了我所有的笔记和文章，方便我使用和分享',
    充当花哨的标题生成器: 'api、test、automation',
    担任公众演讲教练: '我需要帮助指导一位被要求在会议上发表主题演讲的高管',
    充当化妆师: '我需要帮助为一位将要参加她 50 岁生日庆典的客户打造抗衰老的造型',
    充当保姆: '我需要帮助在晚上照顾三个活跃的 4-8 岁男孩',
    担任创业技术律师:
      '一家拥有 IP 的技术初创公司与该初创公司技术的潜在客户之间的协议，该客户为该初创公司正在解决的问题空间提供数据和领域专业知识。您将写下大约 1 a4 页的拟议设计合作伙伴协议，涵盖 IP、机密性、商业权利、提供的数据、数据的使用等所有重要方面。',
    充当启动创意生成器: '我希望在我的小镇上有一个大型购物中心',
    担任统计员: '我需要帮助计算世界上有多少百万张纸币在使用中',
    充当诗人: '我需要一首关于爱情的诗',
    充当紧急响应专业人员: '我蹒跚学步的孩子喝了一点漂白剂，我不知道该怎么办',
    担任销售:
      '试着向我推销一些东西，但要让你试图推销的东西看起来比实际更有价值，并说服我购买它。现在我要假装你在打电话给我，问你打电话的目的是什么。你好，请问你打电话是为了什么？',
    充当旅游指南: '我在上海，我只想参观博物馆',
    充当时间旅行指南: '我想参观文艺复兴时期，你能推荐一些有趣的事件、景点或人物让我体验吗？',
    充当说唱歌手: '我需要一首关于在你自己身上寻找力量的说唱歌曲',
    担任艺人顾问: '我在画超现实主义的肖像画',
    担任法律顾问: '我出了车祸，不知道该怎么办',
    担任金融分析师: '你能告诉我们根据当前情况未来的股市会是什么样子吗？',
    担任投资经理: '目前投资短期前景的最佳方式是什么？',
    担任会计师: '为小型企业制定一个专注于成本节约和长期投资的财务计划',
    充当自助书: '我需要帮助在困难时期保持积极性',
    作为广告商: '我需要帮助针对 18-30 岁的年轻人制作一种新型能量饮料的广告活动',
    担任关系教练: '我需要帮助解决我和配偶之间的冲突',
    充当励志演讲者: '我需要一个关于每个人如何永不放弃的演讲',
    担任人生教练: '我需要帮助养成更健康的压力管理习惯。',
    担任私人厨师: '我是一名素食主义者，我正在寻找健康的晚餐点子',
    担任营养师: '我想为 2 人设计一份素食食谱，每份含有大约 500 卡路里的热量并且血糖指数较低。你能提供一个建议吗？',
    担任私人健身教练: '我需要帮助为想要减肥的人设计一个锻炼计划',
    作为词源学家: '我想追溯‘披萨’这个词的起源',
    充当AI辅助医生: '我需要帮助诊断一例严重的腹痛',
    充当虚拟医生: '最近几天我一直感到头痛和头晕',
    充当医生: '为患有关节炎的老年患者提出一个侧重于整体治疗方法的治疗计划',
    担任牙医: '我需要帮助解决我对冷食的敏感问题。',
    担任心理健康顾问: '我需要一个可以帮助我控制抑郁症状的人',
    充当心理学家: '在这里输入你的想法，如果你解释得更详细，我想你会得到更准确的答案。',
    作为房地产经纪人: '我需要帮助在北京市中心附近找到一栋单层家庭住宅',
    充当宠物行为主义者: '我有一只好斗的德国牧羊犬，它需要帮助来控制它的攻击性',
    充当StackOverflow帖子: '如何将 http.Request 的主体读取到 Golang 中的字符串',
    充当家居装修DIY专家: '我需要帮助创建一个用于招待客人的户外休息区',
    充当室内装饰师: '我正在设计我们的客厅',
    担任摩尔斯电码翻译员: '.... .- ..- --. .... - / - .... .---- .---- ..--- ...--',
    充当教育内容创作者: '我需要帮助制定针对高中生的可再生能源课程计划',
    充当瑜伽士: '我需要帮助在当地社区中心教授初学者瑜伽课程',
    担任催眠治疗师: '我需要帮助来促进与患有严重压力相关问题的患者的会谈',
    担任社交媒体经理: '我需要帮助管理一个组织在 微博 上的存在，以提高品牌知名度。',
    充当数字艺术画廊指南: '我需要帮助设计一个关于南美前卫艺术家的在线展览',
    充当社交媒体影响者: '我需要帮助在抖音上创建一个引人入胜的活动来推广新的运动休闲服装系列',
    担任歌曲推荐人: 'Other Lives - Epic',
    作为基于文本的冒险游戏: '醒来',
    担任产品经理: '请编写具体主题、功能或开发的PRD',
    充当花店: '我应该如何挑选一朵异国情调的花卉？',
    扮演脱口秀喜剧演员: '我想要幽默地看待气候变化',
    担任评论员: '我想写一篇关于气候变化的评论文章',
    '作为UX/UI开发人员': '我需要帮助为我的新移动应用程序设计一个直观的导航系统',
    担任哲学老师: '我需要帮助来理解不同的哲学理论如何应用于日常生活',
    充当哲学家: '我需要帮助制定决策的道德框架',
    担任数学老师: '我需要帮助来理解概率是如何工作的',
    担任编剧: '我需要写一部以巴黎为背景的浪漫剧情电影',
    担任辩论教练: '我希望我们的团队为即将到来的关于前端开发是否容易的辩论做好准备',
    担任辩手: '我想要一篇关于 Deno 的评论文章。',
    担任作曲家: '我写了一首名为“满江红”的诗，需要配乐',
    扮演魔术师: '我要你让我的手表消失！你怎么做到的？'
  }
  let text = desc || defultDesc

  let prompt = `${promptObj[lang] ? promptObj[lang] + ':\n' : ''} ${text}${text.slice(-1) === '.' ? '' : '.'}`
  // let dialogueHistory: any = []

  const generateDesc = async (e: any) => {
    e.preventDefault()
    setGeneratedDescs('')
    setLoading(true)
    if (desc === '') {
      toast.error('内容不能为空！')
      setLoading(false)
      return
    }
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        prompt
      })
    })

    // console.log('Edge function returned.', response)

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value).replace('<|im_end|>', '')
      setGeneratedDescs((prev: any) => {
        return prev + chunkValue
      })
    }

    setLoading(false)
  }
  function copy(text) {
    if (navigator.userAgent && navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      const range: any = document.createRange()
      range.selectNode(document.querySelector('.copyTxt'))
      const selection: any = window.getSelection()
      if (selection.rangeCount > 0) selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('Copy')
      toast('复制成功', {
        icon: '✂️'
      })
      selection.removeAllRanges()
    } else {
      const input: any = document.createElement('INPUT')
      input.value = text
      input.className = ''
      document.body.appendChild(input)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        toast('复制成功', {
          icon: '✂️'
        })
      }
      document.body.removeChild(input)
    }
  }
  function dropDownChange(newLang) {
    setLang(newLang)
    setDesc('')
    setDefultDesc(placeholderDefault[newLang] || '')
  }
  function textareaChange(e) {
    setDesc(e.target.value)
  }
  const messagesEndRef: any = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(scrollToBottom, [generatedDescs])

  let simplifiedContent = '生成的结果'
  return (
    <div className='flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen'>
      <Head>
        <title>AI小助手</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <main className='flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-15'>
        <h1 className='sm:text-2xl text-2xl max-w-3xl font-medium text-slate-600'>你的AI小助手-小C</h1>
        <div className='max-w-xl w-full'>
          <div className='flex mt-6 items-center space-x-3'>
            <Image src='/1-black.png' width={30} height={30} alt='1 icon' />
            <p className='text-left font-medium text-slate-600'>选择目的.</p>
          </div>
          <div className='block mt-3'>
            <DropDown vibe={lang} setVibe={(newLang) => dropDownChange(newLang)} />
          </div>
          {/* 第二步 */}
          <div className='flex mt-5 items-center space-x-3'>
            <Image src='/2-black.png' width={30} height={30} alt='1 icon' className='mb-5 xs:mb-0' />
            <p className='text-left font-medium text-slate-600'>随便写点主题</p>
          </div>
          <div className='text-slate-500 desc mt-3 mb-3'>
            比如：{defultDesc}
            <button
              className='bg-pink rounded-xl text-white font-small px-2 ml-4'
              onClick={() => {
                copy(defultDesc)
              }}
            >
              复制
            </button>
          </div>
          <textarea
            value={desc}
            onChange={(e) => textareaChange(e)}
            rows={4}
            className='w-full rounded-md border-gray-300 shadow-sm  my-2'
            placeholder={`比如：${defultDesc}`}
          />
          {/* focus:border-black focus:ring-black */}
          <Link href='/privacy'>
            <div className='mt-3 items-center space-x-3'>
              <span className='text-slate-400 text-sm flex'>
                请勿上传过于隐私的信息，详情查看
                <span className='text-blue-400 hover:text-blue-400'>《隐私声明》</span>
              </span>
            </div>
          </Link>

          {!loading && (
            <button
              className='bg-pink rounded-xl text-white font-medium px-4 py-2 sm:mt-5 mt-5 w-full'
              onClick={(e) => generateDesc(e)}
            >
              生成 &rarr;
            </button>
          )}
          {loading && (
            <button className='bg-pink rounded-xl text-white font-medium px-4 py-2 sm:mt-8 mt-5 w-full' disabled>
              <LoadingDots color='white' style='large' />
            </button>
          )}
          <br></br>
          <br></br>
          <div className='text-slate-400 text-xs'>- 仅供娱乐 -</div>
        </div>
        <Toaster position='top-center' reverseOrder={false} toastOptions={{ duration: 2000 }} />
        <hr className='h-px bg-gray-700 border-1 dark:bg-gray-700' />
        <ResizablePanel>
          <AnimatePresence mode='wait'>
            <motion.div className='space-y-10 my-10'>
              {generatedDescs && (
                <>
                  <div>
                    <h2 className='sm:text-4xl text-3xl font-bold text-slate-900 mx-auto'>{simplifiedContent}</h2>
                  </div>
                  <div className='space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto'>
                    <div
                      className='bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border'
                      onClick={() => {
                        copy(generatedDescs.trim())
                      }}
                    >
                      <p
                        className='sty1 markdown-body'
                        dangerouslySetInnerHTML={{
                          __html: marked(generatedDescs.toString(), {
                            gfm: true,
                            breaks: true,
                            smartypants: true
                          })
                        }}
                      ></p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      {/* <Footer /> */}
      <div ref={messagesEndRef} />
    </div>
  )
}
console.log(
  '\n %c AI小助手： %c 微信关注公众号 HiGlo 更多更新等你～ \n',
  'color: #ffffff; background: #dd4c7f; padding:5px 0;',
  'background: #030307; padding:5px 0;'
)
// console.log(
//   '%c+',
//   `font-size: 1px;
//   padding: 133px 184px;
//   background-image: url(https://www.higlo.cn/AIMini.png);
//   background-size: contain;
//   background-repeat: no-repeat;
//   color: transparent;`
// )
console.log('%c ', 'padding:133px 184px; font-size: 0; background:url("https://www.higlo.cn/AIMini.png"); no-repeat;')

export default Home

export function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      messages: {
        ...require(`../messages/${locale}.json`)
      }
    }
  }
}
