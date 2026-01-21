// Voice Transcription Service using Gemini API
// Converts audio recordings to text using Google's Gemini AI

class TranscriptionService {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/upload/files?key=';
    }

    /**
     * Transcribe audio blob to text using Gemini API
     * @param {Blob} audioBlob - Audio file blob
     * @param {string} mimeType - MIME type of audio (e.g., 'audio/webm', 'audio/mp3')
     * @returns {Promise<string>} Transcribed text
     */
    async transcribeAudio(audioBlob, mimeType = 'audio/webm') {
        if (!this.apiKey) {
            throw new Error('Gemini API key not configured. Please set it in Settings.');
        }

        try {
            // Step 1: Upload audio file to Gemini
            const uploadedFile = await this.uploadAudioFile(audioBlob, mimeType);

            // Step 2: Send to Gemini for transcription
            const transcript = await this.getTranscriptFromGemini(uploadedFile);

            return transcript;
        } catch (error) {
            console.error('Transcription error:', error);
            throw error;
        }
    }

    /**
     * Upload audio file to Gemini API
     * @private
     */
    async uploadAudioFile(audioBlob, mimeType) {
        const formData = new FormData();
        formData.append('file', audioBlob, `recording.${this.getMimeExtension(mimeType)}`);

        try {
            const response = await fetch(
                `${this.apiEndpoint}${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'X-Goog-Upload-Protocol': 'resumable',
                        'X-Goog-Upload-Command': 'start',
                        'X-Goog-Upload-Header-Content-Length': audioBlob.size,
                        'X-Goog-Upload-Header-Content-Type': mimeType
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const uploadUrl = response.headers.get('X-Goog-Upload-URL');

            // Complete the upload
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'X-Goog-Upload-Command': 'finalize'
                },
                body: audioBlob
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload finalization failed: ${uploadResponse.statusText}`);
            }

            return await uploadResponse.json();
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    }

    /**
     * Get transcript from Gemini using uploaded file
     * @private
     */
    async getTranscriptFromGemini(uploadedFile) {
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: 'Please transcribe this audio recording. Provide only the transcribed text without any additional commentary.'
                        },
                        {
                            file_data: {
                                mime_type: uploadedFile.mimeType,
                                file_uri: uploadedFile.uri
                            }
                        }
                    ]
                }
            ]
        };

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates[0] && result.candidates[0].content) {
                return result.candidates[0].content.parts[0].text;
            }

            throw new Error('No transcription received from Gemini');
        } catch (error) {
            console.error('Gemini transcription error:', error);
            throw error;
        }
    }

    /**
     * Get file extension from MIME type
     * @private
     */
    getMimeExtension(mimeType) {
        const mimeMap = {
            'audio/webm': 'webm',
            'audio/mp3': 'mp3',
            'audio/mpeg': 'mp3',
            'audio/wav': 'wav',
            'audio/ogg': 'ogg',
            'audio/m4a': 'm4a'
        };
        return mimeMap[mimeType] || 'webm';
    }

    /**
     * Update API key
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return !!this.apiKey;
    }
}

// Create global instance
const transcriptionService = new TranscriptionService();
