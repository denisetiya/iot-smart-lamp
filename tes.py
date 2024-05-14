import sys
import os
pyPDF2_path = os.path.join(sys.path[0], 'pyPDF2-0.0.1-py3.10.egg')
sys.path.append(pyPDF2_path)
from gtts import gTTS

from PyPDF2 import PdfReader

def pdfToText(pdf_path):
  reader = PdfReader(pdf_path)
  text = ""
  for page in reader.pages:
    text += page.extract_text()
  return text

def audio(text, output_path):
  tts = gTTS(text=text, lang='id')
  tts.save(output_path)
  
  
text = pdfToText('diagram garis.pdf')
audio(text, 'audio2.mp3')