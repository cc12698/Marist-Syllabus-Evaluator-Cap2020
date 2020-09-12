import sys
import re

textFile = "exampleText.txt"
logFile = "foundLog.txt"

keywords = {    #list of regex commands ment to seach for items
                "courseDes":      ["course description"] ,
                "courseObj":      ["objective(.)*course"] ,
                "courseCred":     ["[0-9](.)*credit"] ,
                "preReq":         [] ,
                "gradeDet":       ["grading:"] ,
                "otherpolicies":  ["policy"] ,
                "instrName":      [] ,
                "instrContact":   ["e(-| )mail:" , "contact:"] ,
                "demoConsistant": [] , # not sure if this can be checked with keywords
                "assesMethod":    ["grading(.)*method"] ,
                "rubrics":        ["rubric"] , # may be missing
                "biblio":         [] ,
                "assignments":    ["assignments" , "bee"] ,
                "taskCrit":       [] ,
                "courseNum":      ["[0-9]{3}( |_)*(N|L|n|l)( |_)*[0-9]{3}" , "course( )*number" , "class( )*number" , "[0-9]{3}( )*(N|L|n|l)"] ,
                "format":         [] ,
                "attenPol":       [] ,
                "reqRead":        ["required(.*)read" , "read(.*)required"] ,
                "courseDes":      ["course description" , "class description"] ,
                "acadHonest":     ["academic honesty"] ,
                "teachAct":       [] ,
                "accommod":       ["Students with disabilities"] ,
                "courseDes":      ["description"] ,
                "diversity":      [] , # not technically req
            }

found = {   #empty dictionary of arrays to store any matches to analyize later
            "courseDes":      [] ,
            "courseObj":      [] ,
            "courseCred":     [] ,
            "preReq":         [] ,
            "gradeDet":       [] ,
            "otherpolicies":  [] ,
            "instrName":      [] ,
            "instrContact":   [] ,
            "demoConsistant": [] , # not sure if this can be checked with keywords
            "assesMethod":    [] ,
            "rubrics":        [] , # may be missing
            "biblio":         [] ,
            "assignments":    [] ,
            "taskCrit":       [] ,
            "courseNum":      [] ,
            "format":         [] ,
            "attenPol":       [] ,
            "reqRead":        [] ,
            "courseDes":      [] ,
            "acadHonest":     [] ,
            "teachAct":       [] ,
            "accommod":       [] ,
            "courseDes":      [] ,
            "diversity":      [] , # not technically req
        }

cmdIdex = 0

def checkFileAnal():
    print("checking file...")
    print(keywords)

    o = open(logFile, "a")
    o.write("\n\n\n\nOutput for " + "textFile") #text file will be the sylibus being evaluated

    s = open(textFile , "r")

    cmdIdex = 0

    for key in keywords: #loops through entire dictionary
        o.write("\n\nResults for " + key + ":")
        for line in s: #loops through each line of sylibus
            cmdIdex = 0
            for i in keywords[key]: #loops through each regex search
                cmdList = keywords[key]
                result = re.search(keywords[key][0] , line) #searches line for regex command
                if(result != None):
                    found[key] = result
                    match = line[result.span()[0] : result.span()[1]]
                    o.write("\nMatch to \"" + keywords[key][0] + "\" in line \"" + line[0 : -2] + "\": " + match)

        s.seek(0) #sets file pointer back to the begining

    return found

def checkFileFast():
    found = len()

    f = open(textFile , "r")
    for i in keywords:
        for line in f:
            if keywords[i] in line:
                found[i] = line

    return found

def getScore():
    print("todo")

checkFileAnal()
