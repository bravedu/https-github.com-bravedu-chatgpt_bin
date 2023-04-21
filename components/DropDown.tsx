import { Menu, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const vibes = [
  '直接发给小C',
  '理成成文章',
  '日报生成器',
  '哄媳妇睡觉小故事',
  '小红书文案生成器',
  '占星家',
  '扮演脱口秀喜剧演员',
  '扮演魔术师',
  '充当化妆师',
  '作为基于文本的冒险游戏',
  '扮疯子',
  '把文字翻译为表情符号',
  '担任社交媒体经理',
  '充当社交媒体影响者',
  '担任摩尔斯电码翻译员',
  '充当教育内容创作者',
  '充当数字艺术画廊指南',
  '担任编剧',
  '担任辩论教练',
  '担任辩手',
  '充当书面作品的标题生成器',
  '充当花哨的标题生成器',
  '充当花店',
  '充当家居装修DIY专家',
  '充当室内装饰师',
  '充当哲学家',
  '担任哲学老师',
  '担任数学老师',
  '担任产品经理',
  '作为UX/UI开发人员',
  '担任创业技术律师',
  '担任评论员',
  '充当启动创意生成器',
  '担任催眠治疗师',
  '充当保姆',
  '担任统计员',
  '担任作曲家',
  '担任歌曲推荐人',
  '充当诗人',
  '充当紧急响应专业人员',
  '担任销售',
  '充当旅游指南',
  '充当时间旅行指南',
  '充当说唱歌手',
  '担任艺人顾问',
  '担任法律顾问',
  '担任金融分析师',
  '担任投资经理',
  '担任会计师',
  '充当自助书',
  '作为广告商',
  '担任歌曲推荐人',
  '担任关系教练',
  '充当励志演讲者',
  '担任公众演讲教练',
  '担任人生教练',
  '担任私人厨师',
  '担任营养师',
  '充当瑜伽士',
  '担任私人健身教练',
  '作为词源学家',
  '充当AI辅助医生',
  '充当虚拟医生',
  '充当医生',
  '担任牙医',
  '担任心理健康顾问',
  '充当心理学家',
  '作为房地产经纪人',
  '充当宠物行为主义者',
  '充当StackOverflow帖子'
] as const

export type VibeType = typeof vibes[number]

interface DropDownProps {
  vibe: VibeType
  setVibe: (vibe: VibeType) => void
}

export default function DropDown({ vibe, setVibe }: DropDownProps) {
  return (
    <Menu as='div' className='relative block text-left w-full'>
      <div>
        {/* hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-pink-400 */}
        <Menu.Button className='inline-flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm'>
          {vibe}
          <ChevronUpIcon className='-mr-1 ml-2 h-5 w-5 ui-open:hidden' aria-hidden='true' />
          <ChevronDownIcon className='-mr-1 ml-2 h-5 w-5 hidden ui-open:block' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className='absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-container'
          key={vibe}
        >
          <div className=''>
            {vibes.map((vibeItem) => (
              <Menu.Item key={vibeItem}>
                {({ active }) => (
                  <button
                    onClick={() => setVibe(vibeItem)}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-500' : 'text-gray-500',
                      vibe === vibeItem ? 'bg-gray-200' : '',
                      'px-4 py-2 text-sm w-full text-left flex items-center space-x-2 justify-between'
                    )}
                  >
                    <span>{vibeItem}</span>
                    {vibe === vibeItem ? <CheckIcon className='w-4 h-4 text-bold' /> : null}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
