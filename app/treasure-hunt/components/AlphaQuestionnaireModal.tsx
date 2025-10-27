'use client';

import { useState } from 'react';
import { X, Send, ArrowRight, Heart, Brain, Users, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import VideoIntroModal from './VideoIntroModal';

interface AlphaQuestionnaireModalProps {
    onClose: () => void;
    onSubmit?: (data: QuestionnaireData) => void;
    videoUrl?: string;
    spotTheme?: string;
}

interface QuestionnaireData {
    stressReflection: string;
    copingStrategies: string;
    meaningOfStress: string;
    supportSystems: string;
    name: string;
    email: string;
    rating: number;
}

export default function AlphaQuestionnaireModal({ onClose, onSubmit, videoUrl, spotTheme }: AlphaQuestionnaireModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<QuestionnaireData>({
        stressReflection: '',
        copingStrategies: '',
        meaningOfStress: '',
        supportSystems: '',
        name: '',
        email: '',
        rating: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showVideoReplay, setShowVideoReplay] = useState(false);

    const handleInputChange = (field: keyof QuestionnaireData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRatingClick = (rating: number) => {
        handleInputChange('rating', rating);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (onSubmit) {
            onSubmit(formData);
        }

        console.log('Questionnaire submitted:', formData);
        setIsSubmitting(false);
        onClose();

        // Navigate to ImageAR page after a short delay
        setTimeout(() => {
            router.push('/image-ar');
        }, 300);
    };

    const handleSkip = () => {
        console.log('Questionnaire skipped');
        onClose();

        // Navigate to ImageAR page even if skipped
        setTimeout(() => {
            router.push('/image-ar');
        }, 300);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '24px 24px'
                        }} />
                    </div>

                    <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl sm:text-3xl mb-3 font-bold flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-red-600 text-2xl font-bold">?</span>
                                    </div>
                                    Alpha Life Essentials
                                </CardTitle>
                                <CardDescription className="text-red-50 text-sm sm:text-base leading-relaxed">
                                    <strong className="block mb-2 text-white">Exploring Life's Big Questions</strong>
                                    Take a deep breath. Pause here. These reflections help you explore what matters most in your life—your relationships, your future, your purpose. There are no right or wrong answers.
                                    <span className="block mt-2 text-white/90 font-medium text-sm">This is a safe space for honest reflection and deeper conversations.</span>
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSkip}
                                className="h-8 w-8 p-0 hover:bg-red-800 text-white flex-shrink-0"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Reflection Section Header */}
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <Heart className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                                        Reflection Questions
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        Take your time with these questions. Your thoughts matter.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stress Reflection */}
                        <div className="space-y-3">
                            <Label htmlFor="stressReflection" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>What causes stress in your life right now?</span>
                            </Label>
                            <Textarea
                                id="stressReflection"
                                placeholder="Think about school, relationships, future plans, social media, expectations..."
                                value={formData.stressReflection}
                                onChange={(e) => handleInputChange('stressReflection', e.target.value)}
                                rows={4}
                                className="resize-none border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* Coping Strategies */}
                        <div className="space-y-3">
                            <Label htmlFor="copingStrategies" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>How do you usually deal with stress?</span>
                            </Label>
                            <Textarea
                                id="copingStrategies"
                                placeholder="Do you talk to friends, exercise, listen to music, pray, avoid it, something else?"
                                value={formData.copingStrategies}
                                onChange={(e) => handleInputChange('copingStrategies', e.target.value)}
                                rows={4}
                                className="resize-none border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* Meaning of Stress */}
                        <div className="space-y-3">
                            <Label htmlFor="meaningOfStress" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>What do you think stress reveals about what matters to you?</span>
                            </Label>
                            <Textarea
                                id="meaningOfStress"
                                placeholder="What does your stress tell you about your values, hopes, or fears?"
                                value={formData.meaningOfStress}
                                onChange={(e) => handleInputChange('meaningOfStress', e.target.value)}
                                rows={4}
                                className="resize-none border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* Support Systems */}
                        <div className="space-y-3">
                            <Label htmlFor="supportSystems" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>Who or what helps you when things get tough?</span>
                            </Label>
                            <Textarea
                                id="supportSystems"
                                placeholder="Friends, family, faith, community, hobbies, nature..."
                                value={formData.supportSystems}
                                onChange={(e) => handleInputChange('supportSystems', e.target.value)}
                                rows={4}
                                className="resize-none border-2 border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900 placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* Replay Video Button */}
                        {videoUrl && (
                            <div className="border-t-2 border-gray-200 pt-6 pb-2">
                                <Button
                                    type="button"
                                    onClick={() => setShowVideoReplay(true)}
                                    variant="outline"
                                    className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700 font-semibold h-14 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Video className="w-5 h-5" />
                                    Replay {spotTheme ? `"${spotTheme}"` : 'This'} Video
                                </Button>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-sm text-gray-600 italic">
                                    Optional: Connect with Alpha
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 -mt-2 text-center">
                            If you'd like to explore these questions further with others, leave your details below.
                        </p>

                        {/* Optional Fields - Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Your Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="border-2 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="border-2 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                />
                            </div>
                        </div>

                        {/* Rating Field */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">
                                How was this reflection experience?
                            </Label>
                            <div className="flex gap-2 justify-center sm:justify-start">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingClick(star)}
                                        className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                                        aria-label={`Rate ${star} out of 5`}
                                    >
                                        <Heart
                                            className={`w-8 h-8 transition-colors ${
                                                star <= formData.rating
                                                    ? 'fill-red-600 text-red-600'
                                                    : 'text-gray-300 hover:text-red-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="p-5 bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg border-2 border-red-200 shadow-sm">
                            <h4 className="font-bold text-base text-red-900 mb-2 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-600" />
                                About Alpha Life Essentials
                            </h4>
                            <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                                You've just experienced part of <strong>Alpha Life Essentials</strong>—a series exploring real-life challenges like stress, identity, purpose, and belonging. Through candid stories and practical wisdom, we dive into questions like: <em>Where do we find peace? What if weakness could become strength?</em>
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed">
                                Life Essentials connects ancient wisdom with modern insights, creating a safe space for Gen Z and Gen Alpha to explore faith conversations without judgment—just honest dialogue with people like you.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSkip}
                                className="flex-1 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 font-semibold h-12 transition-colors"
                            >
                                Skip for Now
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold h-12 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Send className="w-5 h-5 mr-2 animate-pulse" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Reflection
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Video Replay Modal */}
            {showVideoReplay && videoUrl && (
                <VideoIntroModal
                    onComplete={() => setShowVideoReplay(false)}
                    videoUrl={videoUrl}
                    showTimer={false}
                    spotTheme={spotTheme}
                />
            )}
        </div>
    );
}
