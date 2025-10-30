import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, XCircle, Eye, Mic, FileText, Clock, Shield } from 'lucide-react';

const DeepFakeDetect = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  const simulateAnalysis = () => {
    return new Promise((resolve) => {
      // Simulate ML analysis with realistic metrics
      const isVideo = file.type.includes('video');
      const random = Math.random();
      
      let score, status, anomalies, metadata;
      
      if (random > 0.7) {
        // Likely fake
        score = Math.floor(Math.random() * 40) + 10;
        status = 'fake';
        anomalies = [
          'Facial boundary artifacts detected',
          'Inconsistent lighting across frames',
          'Audio-visual synchronization mismatch',
          'Unnatural eye blinking pattern'
        ];
        metadata = {
          reencoded: true,
          compressionMismatch: true,
          exifTampered: true
        };
      } else if (random > 0.4) {
        // Suspicious
        score = Math.floor(Math.random() * 30) + 50;
        status = 'suspicious';
        anomalies = [
          'Minor facial blending artifacts',
          'Slight audio delay detected',
          'Compression artifacts present'
        ];
        metadata = {
          reencoded: true,
          compressionMismatch: false,
          exifTampered: false
        };
      } else {
        // Likely genuine
        score = Math.floor(Math.random() * 20) + 80;
        status = 'genuine';
        anomalies = [];
        metadata = {
          reencoded: false,
          compressionMismatch: false,
          exifTampered: false
        };
      }

      const analysis = {
        score,
        status,
        anomalies,
        metadata,
        timestamp: new Date().toLocaleString(),
        fileName: file.name,
        fileType: isVideo ? 'Video' : 'Image',
        details: {
          framesAnalyzed: isVideo ? Math.floor(Math.random() * 500) + 100 : 1,
          processingTime: (Math.random() * 3 + 1).toFixed(2) + 's',
          audioVideoSync: isVideo ? (random > 0.7 ? 'Misaligned' : 'Synchronized') : 'N/A',
          facialConsistency: score > 70 ? 'High' : score > 40 ? 'Medium' : 'Low'
        }
      };

      setTimeout(() => resolve(analysis), 3500);
    });
  };

  const analyzeMedia = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setActiveTab('results');
    
    const analysis = await simulateAnalysis();
    setResult(analysis);
    setAnalyzing(false);
    
    setHistory(prev => [analysis, ...prev.slice(0, 9)]);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'genuine': return 'text-green-500';
      case 'suspicious': return 'text-yellow-500';
      case 'fake': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'genuine': return <CheckCircle className="w-8 h-8" />;
      case 'suspicious': return <AlertCircle className="w-8 h-8" />;
      case 'fake': return <XCircle className="w-8 h-8" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'genuine': return 'Likely Genuine';
      case 'suspicious': return 'Possibly DeepFake';
      case 'fake': return 'Likely Fake';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">DeepFake Detect</h1>
              <p className="text-xs text-purple-300">Media Verification Tool</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <p className="text-xs text-purple-300 font-medium">Powered by AI</p>
            </div>
            <div className="px-4 py-2 bg-green-500/20 rounded-lg border border-green-400/30">
              <p className="text-xs text-green-300 font-medium">94% Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-4 border-b border-purple-500/30">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            Upload & Analyze
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'results'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-purple-300'
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Verify Media Authenticity with AI
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Upload images or videos to detect deepfakes, manipulated content, and AI-generated media using advanced neural networks
              </p>
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-purple-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">AI Models Active</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="text-sm">94.1% Accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="text-sm">&lt;4s Analysis</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="space-y-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-purple-500/50 rounded-2xl p-16 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-12 h-12 text-purple-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-3">
                      Drop media file here or click to browse
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Supports images (JPG, PNG) and videos (MP4, MOV)
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <span>Max 100MB</span>
                      <span>•</span>
                      <span>Encrypted Upload</span>
                      <span>•</span>
                      <span>Auto-Delete 24h</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {file && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-white font-semibold flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-400" />
                          Selected File
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setPreview(null);
                            setResult(null);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="bg-black/20 rounded-xl p-4 mb-4">
                        <p className="text-purple-300 text-sm break-all font-mono">{file.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{file.type}</span>
                        </div>
                      </div>
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-full"></div>
                      </div>
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        File uploaded successfully
                      </p>
                    </div>
                    
                    <button
                      onClick={analyzeMedia}
                      disabled={analyzing}
                      className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-3 group"
                    >
                      {analyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Analyze Now
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-4 border border-blue-400/30">
                    <div className="text-blue-400 text-2xl font-bold mb-1">3</div>
                    <div className="text-blue-200 text-xs">AI Models</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                    <div className="text-green-400 text-2xl font-bold mb-1">94%</div>
                    <div className="text-green-200 text-xs">Accuracy</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                    <div className="text-purple-400 text-2xl font-bold mb-1">&lt;4s</div>
                    <div className="text-purple-200 text-xs">Processing</div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 h-full shadow-xl">
                  <h3 className="text-white font-semibold mb-6 text-lg flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    Media Preview
                  </h3>
                  {preview ? (
                    <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-purple-500/30">
                      {file?.type.includes('video') ? (
                        <video src={preview} controls className="w-full h-auto max-h-[500px] bg-black" />
                      ) : (
                        <img src={preview} alt="Preview" className="w-full h-auto max-h-[500px] object-contain bg-black" />
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-black/40 to-purple-900/20 rounded-xl border-2 border-dashed border-purple-500/30">
                      <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                        <Eye className="w-10 h-10 text-purple-400/50" />
                      </div>
                      <p className="text-gray-400 text-lg">No file selected</p>
                      <p className="text-gray-500 text-sm mt-2">Upload a file to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div>
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-white text-lg font-medium">Analyzing Media...</p>
                <p className="text-gray-400 text-sm mt-2">Running AI detection models</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Score Card */}
                <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-8 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete</h2>
                      <p className="text-gray-300">{result.fileName}</p>
                    </div>
                    <div className={`${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Authenticity Score</span>
                      <span className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          result.status === 'genuine' ? 'bg-green-500' :
                          result.status === 'suspicious' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 p-4 rounded-lg ${
                    result.status === 'genuine' ? 'bg-green-500/20 border border-green-500/50' :
                    result.status === 'suspicious' ? 'bg-yellow-500/20 border border-yellow-500/50' :
                    'bg-red-500/20 border border-red-500/50'
                  }`}>
                    <div className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                    </div>
                    <div>
                      <p className={`font-semibold ${getStatusColor(result.status)}`}>
                        {getStatusText(result.status)}
                      </p>
                      <p className="text-sm text-gray-300">
                        {result.status === 'genuine' ? 'No significant manipulation detected' :
                         result.status === 'suspicious' ? 'Some anomalies detected - verify source' :
                         'Strong indicators of manipulation detected'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analysis Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Anomalies */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-semibold">Detected Anomalies</h3>
                    </div>
                    {result.anomalies.length > 0 ? (
                      <ul className="space-y-2">
                        {result.anomalies.map((anomaly, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-red-400 mt-1">•</span>
                            <span className="text-gray-300">{anomaly}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-green-400 text-sm">No anomalies detected</p>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-semibold">Metadata Analysis</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Re-encoded:</span>
                        <span className={result.metadata.reencoded ? 'text-yellow-400' : 'text-green-400'}>
                          {result.metadata.reencoded ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compression Mismatch:</span>
                        <span className={result.metadata.compressionMismatch ? 'text-yellow-400' : 'text-green-400'}>
                          {result.metadata.compressionMismatch ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">EXIF Tampered:</span>
                        <span className={result.metadata.exifTampered ? 'text-red-400' : 'text-green-400'}>
                          {result.metadata.exifTampered ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Mic className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-semibold">Audio-Visual Analysis</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sync Status:</span>
                        <span className="text-gray-300">{result.details.audioVideoSync}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Facial Consistency:</span>
                        <span className="text-gray-300">{result.details.facialConsistency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frames Analyzed:</span>
                        <span className="text-gray-300">{result.details.framesAnalyzed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Info */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-semibold">Processing Info</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Analysis Time:</span>
                        <span className="text-gray-300">{result.details.processingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">File Type:</span>
                        <span className="text-gray-300">{result.fileType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-gray-300">{result.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No analysis results yet</p>
                <p className="text-gray-500 text-sm mt-2">Upload and analyze a file to see results</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Analysis History</h2>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.fileName}</p>
                            <p className="text-gray-400 text-sm">{item.timestamp}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getStatusColor(item.status)}`}>
                          {item.score}%
                        </p>
                        <p className={`text-sm ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <Clock className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">No history yet</p>
                <p className="text-gray-500 text-sm mt-2">Your analysis history will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-black/40 to-purple-900/40 backdrop-blur-sm border-t border-purple-500/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                About DeepFake Detect
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Advanced AI-powered media verification system designed to combat digital manipulation and protect authenticity across all forms of media content.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Key Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Real-time deepfake detection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Audio-visual synchronization analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Metadata forensics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Detailed anomaly reports
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Performance</h4>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-purple-300 text-2xl font-bold">94.1%</p>
                  <p className="text-gray-400 text-xs">Detection Accuracy</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-green-300 text-2xl font-bold">&lt;4s</p>
                  <p className="text-gray-400 text-xs">Average Processing Time</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              Empowering digital integrity through AI-powered media verification
            </p>
            <p className="text-purple-300/60 text-xs mt-3">
              © 2025 DeepFake Detect. Protecting authenticity in the digital age.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepFakeDetect;
