'use client';

import { useState } from 'react';
import { X, Send, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

interface AlphaQuestionnaireModalProps {
    onClose: () => void;
    onSubmit?: (data: QuestionnaireData) => void;
}

interface QuestionnaireData {
    name: string;
    email: string;
    rating: number;
    submission: string;
    interest: string;
    hearAbout: string;
}

export default function AlphaQuestionnaireModal({ onClose, onSubmit }: AlphaQuestionnaireModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<QuestionnaireData>({
        name: '',
        email: '',
        rating: 0,
        submission: '',
        interest: '',
        hearAbout: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl mb-2">Interested in Alpha?</CardTitle>
                            <CardDescription>
                                Alpha is a series of sessions exploring the Christian faith. Join us to explore life's big questions in a friendly, open environment.
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="h-8 w-8 p-0 -mt-2"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                            />
                        </div>

                        {/* Rating Field */}
                        <div className="space-y-2">
                            <Label>How would you rate your experience?</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingClick(star)}
                                        className="transition-colors"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= formData.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submission Text Area */}
                        <div className="space-y-2">
                            <Label htmlFor="submission">Share your thoughts (Optional)</Label>
                            <Textarea
                                id="submission"
                                placeholder="Tell us about your experience or any questions you have..."
                                value={formData.submission}
                                onChange={(e) => handleInputChange('submission', e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        </div>

                        {/* Interest Level */}
                        <div className="space-y-2">
                            <Label htmlFor="interest">What interests you most about Alpha?</Label>
                            <select
                                id="interest"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.interest}
                                onChange={(e) => handleInputChange('interest', e.target.value)}
                                required
                            >
                                <option value="">Select an option...</option>
                                <option value="faith">Exploring faith and spirituality</option>
                                <option value="community">Meeting new people and community</option>
                                <option value="questions">Asking big life questions</option>
                                <option value="growth">Personal growth and development</option>
                                <option value="curious">Just curious to learn more</option>
                            </select>
                        </div>

                        {/* How did you hear about us */}
                        <div className="space-y-2">
                            <Label htmlFor="hearAbout">How did you hear about Alpha?</Label>
                            <Input
                                id="hearAbout"
                                type="text"
                                placeholder="Friend, social media, church, etc."
                                value={formData.hearAbout}
                                onChange={(e) => handleInputChange('hearAbout', e.target.value)}
                            />
                        </div>

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="font-semibold text-sm text-blue-900 mb-1">What happens next?</h4>
                            <p className="text-xs text-blue-800">
                                We'll send you information about upcoming Alpha courses in your area, including dates, times, and locations. No pressure - you can always change your mind!
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSkip}
                                className="flex-1"
                            >
                                Maybe Later
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-4 h-4 mr-2" />
                                        I'm Interested
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
