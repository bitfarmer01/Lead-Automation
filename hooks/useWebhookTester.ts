import React, { useState, useMemo, useCallback } from 'react';
import { Entry, WebhookResponse, SavedWebhook } from '../types';
import useLocalStorage from './useLocalStorage';
import { toast } from 'react-toastify';

interface UseWebhookTesterProps {
  entries: Entry[];
}

export function useWebhookTester({ entries }: UseWebhookTesterProps) {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<WebhookResponse | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const [savedWebhooks, setSavedWebhooks] = useLocalStorage<SavedWebhook[]>('savedWebhooks', []);
  const [selectedWebhookName, setSelectedWebhookName] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [newWebhookName, setNewWebhookName] = useState<string>('');

  const jsonPayload = useMemo(() => {
    const payloadObjects = entries.map(({ id, ...rest }) => rest);
    return JSON.stringify(payloadObjects, null, 2);
  }, [entries]);

  const handleWebhookUrlChange = useCallback((url: string) => {
    setWebhookUrl(url);
    const matchingWebhook = savedWebhooks.find(w => w.url === url.trim());
    setSelectedWebhookName(matchingWebhook ? matchingWebhook.name : '');
  }, [savedWebhooks]);
  
  const handleOpenConfirmation = useCallback(() => {
    setError(null);
    if (!webhookUrl.trim()) {
      setError('Please enter a webhook URL.');
      return;
    }
    try {
      new URL(webhookUrl);
    } catch (e) {
      setError('The webhook URL is not valid.');
      return;
    }
    setShowConfirmation(true);
  }, [webhookUrl]);
  
  const handleTestWebhook = useCallback(async () => {
    setShowConfirmation(false);
    setResponse(null);
    setError(null);
    setIsTesting(true);
    toast.info('Sending webhook request...');
    try {
      const res = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonPayload,
      });

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => { resHeaders[key] = value; });
      const body = await res.text();
      setResponse({ status: res.status, statusText: res.statusText, headers: resHeaders, body });
      toast.success(`Success: ${res.status} ${res.statusText}`);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof TypeError ? 'Failed to send request. This might be due to a network error or a CORS policy on the destination server. Testing from a browser is often restricted by CORS. If this fails, consider testing your endpoint from a server-side environment.' : 'An unknown error occurred while sending the request.';
      setError(errorMessage);
      toast.error('Request Failed. See error below.');
    } finally {
      setIsTesting(false);
    }
  }, [webhookUrl, jsonPayload]);

  const handleOpenSaveModal = useCallback(() => {
    if (!webhookUrl.trim()) {
        setError("Cannot save an empty URL.");
        return;
    }
    setError(null);
    const existing = savedWebhooks.find(w => w.url === webhookUrl.trim());
    setNewWebhookName(existing ? existing.name : '');
    setShowSaveModal(true);
  }, [webhookUrl, savedWebhooks]);

  const handleConfirmSave = useCallback(() => {
    if (!newWebhookName.trim()) return;
    const trimmedUrl = webhookUrl.trim();
    let newSavedWebhooks = [...savedWebhooks];
    const existingIndex = newSavedWebhooks.findIndex(w => w.url === trimmedUrl);

    if (existingIndex > -1) {
      newSavedWebhooks[existingIndex].name = newWebhookName.trim();
    } else {
      newSavedWebhooks.push({ name: newWebhookName.trim(), url: trimmedUrl });
    }
    setSavedWebhooks(newSavedWebhooks);
    setSelectedWebhookName(newWebhookName.trim());
    setNewWebhookName('');
    setShowSaveModal(false);
  }, [newWebhookName, webhookUrl, savedWebhooks, setSavedWebhooks]);

  const handleSelectWebhook = useCallback((name: string) => {
    setSelectedWebhookName(name);
    const selected = savedWebhooks.find(w => w.name === name);
    setWebhookUrl(selected ? selected.url : '');
  }, [savedWebhooks]);

  const handleDeleteSelectedWebhook = useCallback(() => {
    if (!selectedWebhookName) return;
    setSavedWebhooks(savedWebhooks.filter(w => w.name !== selectedWebhookName));
    setSelectedWebhookName('');
    setWebhookUrl('');
  }, [selectedWebhookName, savedWebhooks, setSavedWebhooks]);

  return {
    webhookUrl,
    setWebhookUrl,
    jsonPayload,
    isTesting,
    error,
    response,
    showConfirmation,
    setShowConfirmation,
    savedWebhooks,
    selectedWebhookName,
    showSaveModal,
    setShowSaveModal,
    newWebhookName,
    setNewWebhookName,
    handleWebhookUrlChange,
    handleOpenConfirmation,
    handleTestWebhook,
    handleOpenSaveModal,
    handleConfirmSave,
    handleSelectWebhook,
    handleDeleteSelectedWebhook,
  };
}