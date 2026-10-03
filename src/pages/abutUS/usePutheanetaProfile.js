import { useState } from "react";
import { navigateBack } from "../../utils/navigation";
import chefAvatar from "../../assets/chum-bunthary-portrait.png";
import managerAvatar from "../../assets/prom-putheanita.png";

// Authentic Khmer Cuisine Restaurant Profile Data
export const ownerDetails = {
  name: "លោកស្រី ជុំ ប៊ុនថារី (CHUM BUNTHARY)",
  title: "ម្ចាស់ហាង & ស្ថាបនិក",
  company: "ភោជនីយដ្ឋាន ផ្ទះបៃតង (Baitong House)",
  avatar: chefAvatar,
  story: "កើត និងធំធាត់ឡើងក្នុងទឹកដីកម្ពុជា ជាមួយក្លិនឈ្ងុយនៃគ្រឿងបុកស្លឹកគ្រៃ រមៀត រំដេង ខ្ទិះដូង និងអង្ករផ្ការំដួលថ្មី ខ្ញុំតែងតែមានក្តីស្រឡាញ់យ៉ាងជ្រាលជ្រៅចំពោះកេរដំណែលម្ហូបខ្មែរយើង។ ខ្ញុំបានបង្កើត 'ភោជនីយដ្ឋាន ផ្ទះបៃតង' ឡើង ដើម្បីថែរក្សា និងលើកតម្កើងរសជាតិម្ហូបខ្មែរប្រពៃណីពិតៗ នាំយករូបមន្តដូនតាដែលផ្ទេរតរៀងមក បម្រើជូនក្នុងបរិយាកាសកក់ក្តៅ ដោយប្រើប្រាស់គ្រឿងផ្សំក្នុងស្រុកស្រស់ៗពីចម្ការធម្មជាតិ។",
  missionPoints: [
    {
      title: "រូបមន្តបុរាណដូនតា",
      desc: "គោរព និងថែរក្សាបច្ចេកទេសចម្អិនម្ហូបខ្មែរបុរាណ គ្រឿងបុកត្បាល់ថ្ម និងការរម្ងាស់ក្នុងឆ្នាំងដី ដោយមិនប្រើសារធាតុគីមី ឬប៊ីចេងជំនួយរសជាតិឡើយ។"
    },
    {
      title: "គ្រឿងផ្សំក្នុងស្រុកស្រស់ៗពីចម្ការ",
      desc: "សហការផ្ទាល់ជាមួយកសិករខ្មែរនៅខេត្តកំពតសម្រាប់ម្រេចកំពតពិតៗ ខេត្តបាត់ដំបងសម្រាប់អង្ករផ្ការំដួល និងទន្លេសាបសម្រាប់ត្រីស្រស់ៗជារៀងរាល់ព្រឹក។"
    },
    {
      title: "មោទនភាពម្ហូបជាតិខ្មែរ",
      desc: "បង្ហាញពីភាពសម្បូរបែប តុល្យភាពរសជាតិ និងភាពកក់ក្តៅនៃវប្បធម៌ម្ហូបខ្មែរជូនដល់ប្រជាជនកម្ពុជា និងភ្ញៀវអន្តរជាតិប្រកបដោយមោទនភាពខ្ពស់។"
    }
  ]
};

// Visual Org Chart / Tree Hierarchy Data
export const teamDetails = {
  founder: {
    name: "លោកស្រី ជុំ ប៊ុនថារី (CHUM BUNTHARY)",
    title: "ម្ចាស់ហាង ផ្ទះបៃតង (Shop Owner)",
    avatar: chefAvatar,
    desc: "ដឹកនាំទស្សនវិស័យ រសជាតិដើមប្រពៃណី និងរក្សាគុណភាពម្ហូបខ្មែរគ្រប់មុខឱ្យស្រស់ឆ្ងាញ់ជារៀងរាល់ថ្ងៃ។",
    facebookUrl: "https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr"
  },
  manager: {
    name: "កញ្ញា ពុធធានីតា ព្រំ (Putheanita Prom)",
    title: "អ្នកគ្រប់គ្រងគេហទំព័រ & ប្រព័ន្ធ (Website Manager)",
    avatar: managerAvatar,
    desc: "ទទួលបន្ទុកគ្រប់គ្រងគេហទំព័រ ប្រព័ន្ធកុម្ម៉ង់ម្ហូបអនឡាញ និងសម្របសម្រួលសេវាកម្មអតិថិជន។",
    email: "putheanitaprom@gmail.com",
    phone: "015 241471",
    facebookUrl: "https://www.facebook.com/share/18cXkjfnwn/?mibextid=wwXIfr"
  }
};

/**
 * Controller Hook for the Restaurant About Profile
 */
export function usePutheanetaProfile(onBack) {
  const [activeTab, setActiveTab] = useState("story"); // 'story', 'mission', 'team', 'contact'
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log("Message sent to Baitong House:", message);
    setIsSent(true);
    setMessage("");

    setTimeout(() => {
      setIsSent(false);
    }, 3500);
  };

  const goBack = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigateBack();
    }
  };

  return {
    activeTab,
    message,
    isSent,
    setMessage,
    handleTabChange,
    handleMessageSubmit,
    goBack,
    facebookUrl: "https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr",
    managerFacebookUrl: "https://www.facebook.com/share/18cXkjfnwn/?mibextid=wwXIfr",
    ownerDetails,
    lightboxImage,
    setLightboxImage,
    teamDetails
  };
}
