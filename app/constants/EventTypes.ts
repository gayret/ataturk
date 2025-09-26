import educationIcon from '@/app/assets/icons/category-education.svg'
import militaryIcon from '@/app/assets/icons/category-military.svg'
import politicalIcon from '@/app/assets/icons/category-political.svg'
import personalIcon from '@/app/assets/icons/category-personal.svg'
import visitIcon from '@/app/assets/icons/category-visit.svg'
import reformIcon from '@/app/assets/icons/category-reform.svg'

const EventTypes = [
    {
        id: 1,
        title: 'kisisel',
        label: 'Kişisel',
        icon: personalIcon
    },
    {
        id: 2,
        title: 'askeri',
        label: 'Askeri',
        icon: militaryIcon,
    },
    {
        id: 3,
        title: 'politik',
        label: 'Siyasi',
        icon: politicalIcon,
    },
    {
        id: 4,
        title: 'egitim',
        label: 'Eğitim',
        icon: educationIcon,
    },
    {
        id: 5,
        title: 'reform',
        label: 'Reform',
        icon: reformIcon,
    },
    {
        id: 6,
        title: 'ziyaret',
        label: 'Ziyaret',
        icon: visitIcon,
    }
]

export default EventTypes