import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    app: 'TRẠNG NGUYÊN AI 2.0 – LỚP HỌC KIẾN TẠO',
    author: 'Danh Thanh',
    school: 'Trường TH-THCS Vĩnh Điều - An Giang',
    year: '2026-2027',
  });
});

// Endpoint: AI Generate Exercise Questions
app.post('/api/gemini/generate-questions', async (req, res) => {
  const { subject, topic, lessonTitle, count = 10, questionTypes, grade = 2 } = req.body;
  const numQuestions = Math.min(Math.max(Number(count) || 10, 7), 10);

  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(200).json({
      success: false,
      isFallback: true,
      message: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Đã chuyển sang kho dữ liệu mẫu chuẩn SGK.',
    });
  }

  try {
    const prompt = `Bạn là chuyên gia giáo dục tiểu học và giáo viên dạy lớp 2 nhiều năm kinh nghiệm, am hiểu sâu sắc chương trình GDPT 2018 và bộ sách "Kết nối tri thức với cuộc sống".
Hãy tạo bộ câu hỏi luyện tập tương tác môn ${subject === 'math' ? 'Toán 2' : 'Tiếng Việt 2'}, bài học "${lessonTitle}" (Chủ đề / Tuần: "${topic}").

Số lượng câu hỏi: ĐÚNG ${numQuestions} câu hỏi.
Phân bố mức độ:
- Mức 1 (Nhận biết): khoảng 30% (${Math.round(numQuestions * 0.3)} câu)
- Mức 2 (Thông hiểu): khoảng 40% (${Math.round(numQuestions * 0.4)} câu)
- Mức 3 (Vận dụng): khoảng 30% (${numQuestions - Math.round(numQuestions * 0.3) - Math.round(numQuestions * 0.4)} câu)

Yêu cầu nội dung:
- Phù hợp tuyệt đối với tâm lý lứa tuổi 7-8 tuổi (học sinh lớp 2).
- Ngôn ngữ trong sáng, chuẩn mực, ngắn gọn, dễ hiểu.
- Các bài toán phải có dữ liệu thực tế, gần gũi (bút chì, que tính, quả cam, bông hoa, số đo độ dài dm, cm, m, lít, kg, tiền Việt Nam đồng, hình khối).
- Với Tiếng Việt: từ ngữ chỉ sự vật/hoạt động/đặc điểm, câu giới thiệu/nêu hoạt động/nêu đặc điểm, dấu câu, chính tả âm vần phân biệt s/x, d/gi, r/d, l/n, c/k, ch/tr, từ ngữ theo chủ điểm học kì.
- Tuyệt đối không đưa đáp án sai, không tạo câu hỏi mơ hồ.
- Mỗi câu hỏi trắc nghiệm phải có 4 phương án, đúng 1 phương án duy nhất đúng.
- Giải thích ngắn gọn, động viên học sinh khi làm đúng hoặc gợi ý khi làm sai.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            lessonTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    description: 'multiple-choice, true-false, fill-blank, math-input, match-pair',
                  },
                  level: {
                    type: Type.STRING,
                    description: 'nhan_biet, thong_hieu, van_dung',
                  },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '4 options for multiple-choice or true-false',
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  sgkRef: { type: Type.STRING },
                },
                required: ['id', 'type', 'level', 'question', 'correctAnswer', 'explanation'],
              },
            },
          },
          required: ['title', 'subject', 'lessonTitle', 'questions'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini không trả về kết quả');
    }

    const data = JSON.parse(text);
    return res.json({
      success: true,
      isFallback: false,
      data,
    });
  } catch (error: any) {
    console.error('Error generating questions with Gemini:', error);
    return res.status(200).json({
      success: false,
      isFallback: true,
      error: error.message || 'Lỗi khi gọi Gemini API',
      message: 'Không thể tạo bằng AI lúc này. Hệ thống sẽ cung cấp bộ câu hỏi chuẩn từ thư viện.',
    });
  }
});

// Endpoint: Chatbot Bạn Học AI Lớp 2
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history = [], currentStudentName = 'Bạn nhỏ' } = req.body;

  if (!aiClient || !apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Intelligent local fallback responses for student
    const lower = (message || '').toLowerCase();
    let reply = `Chào ${currentStudentName}! Mình là Bạn Học AI - Trợ lý tri thức lớp 2. `;

    if (lower.includes('cộng') || lower.includes('phép cộng') || lower.includes('qua 10')) {
      reply += `Về phép cộng qua 10, bí quyết là em hãy tách số sau để ghép với số trước cho đủ 10, rồi cộng với số còn lại nhé! Ví dụ: 9 + 5: em tách 5 = 1 + 4, ta có 9 + 1 = 10, 10 + 4 = 14! Em có muốn thử làm 8 + 5 không nè?`;
    } else if (lower.includes('lít') || lower.includes('dung tích')) {
      reply += `Lít (viết tắt là l) là đơn vị đo dung tích, thường dùng để đo lượng nước, sữa, dầu ăn... Ví dụ chai nước ngọt 1 lít, bình nước 2 lít. Em hãy vào mục "Kho bài tập tương tác" -> Chủ đề 3 để làm bài Luyện tập về Lít nhé!`;
    } else if (lower.includes('từ chỉ đặc điểm') || lower.includes('đặc điểm')) {
      reply += `Từ chỉ đặc điểm là những từ nói về màu sắc (đỏ, xanh, vàng...), hình dáng (tròn, vuông, cao, thấp...), tính tình hoặc tính chất (chăm chỉ, ngoan ngoãn, ngọt ngào...). Em có thể tìm thấy bạn nhỏ nào "chăm chỉ" trong lớp mình không?`;
    } else if (lower.includes('chào') || lower.includes('hi') || lower.includes('hello')) {
      reply += `Chúc em một ngày học tập thật vui vẻ và hăng say! Hôm nay em muốn ôn môn Toán hay môn Tiếng Việt với mình nào?`;
    } else {
      reply += `Mình rất vui được đồng hành cùng em! Em có thể hỏi mình về các bài học Toán 2 (như phép cộng có nhớ, bảng nhân 2, xem đồng hồ, đo độ dài...) hoặc Tiếng Việt 2 (từ chỉ sự vật, câu nêu hoạt động, luyện viết...). Em cần mình giải thích bài nào nè?`;
    }

    return res.json({
      reply,
      isFallback: true,
    });
  }

  try {
    const systemInstruction = `Bạn là "BẠN HỌC AI – TRỢ LÝ TRI THỨC LỚP 2", một chú robot hoạt hình thông minh, ân cần, vui vẻ và thân thiện của trường TH-THCS Vĩnh Điều.
Học sinh trò chuyện với bạn là trẻ em 7-8 tuổi (học sinh lớp 2), đang học bộ sách "Kết nối tri thức với cuộc sống".

Nguyên tắc quan trọng:
1. Luôn dùng giọng điệu ấm áp, xưng là "mình" hoặc "Bạn Học AI", gọi học sinh là "em" hoặc tên của học sinh (${currentStudentName}). Dùng từ ngữ đơn giản, gần gũi, khích lệ (tuyệt vời, cố lên, giỏi lắm).
2. Khi học sinh hỏi về kiến thức (phép cộng qua 10, đơn vị lít, từ chỉ sự vật/đặc điểm, xem đồng hồ...):
   - Hướng dẫn theo ví dụ trực quan, từng bước.
   - Không chỉ quẳng ra đáp án ngay, mà gợi ý và hỏi lại học sinh để học sinh tự suy nghĩ.
3. Khi học sinh xin bài tập:
   - Gợi ý chủ đề tương ứng trong SGK Kết nối tri thức với cuộc sống Lớp 2.
   - Cho 1-2 câu đố vui nhỏ nhẹ nhàng để cùng chơi.
4. Trả lời ngắn gọn (dưới 120 từ), không dài dòng, không dùng từ ngữ trừu tượng của người lớn.
5. Luôn tôn trọng quy chuẩn văn hóa, an toàn cho trẻ em.`;

    const chat = aiClient.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: `Học sinh hỏi: "${message}"`,
    });

    const reply = response.text || 'Mình đây rồi! Em hãy nói lại câu hỏi một lần nữa nhé!';
    return res.json({
      reply,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return res.json({
      reply: `Chào em! Mình là Bạn Học AI lớp 2. Em đang muốn tìm hiểu về bài Toán hay Tiếng Việt nào hôm nay? Hãy chọn bài trên thanh menu hoặc hỏi mình nhé!`,
      isFallback: true,
    });
  }
});

// Production or Vite development integration
if (isProduction) {
  const distDir = path.resolve(__dirname, 'dist');
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
  app.listen(PORT, () => {
    console.log(`Server running in production on port ${PORT}`);
  });
} else {
  // Mount Vite middlewares in development
  import('vite').then(async (viteModule) => {
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.listen(PORT, () => {
      console.log(`Server running with Vite middleware on port ${PORT}`);
    });
  });
}
